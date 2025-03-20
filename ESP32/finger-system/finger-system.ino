#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <Adafruit_Fingerprint.h>
#include <Wire.h>
#include <LCDI2C_Multilingual.h> // Đảm bảo dùng phiên bản tương thích ESP32

LCDI2C_Vietnamese lcd(0x27, 16, 2);
HardwareSerial mySerial(2);
Adafruit_Fingerprint finger = Adafruit_Fingerprint(&mySerial);

const char* ssid = "TP-LINK_A1CB";
const char* password = "12341234";
const char* serverUrl = "http://192.170.32.101:5000";
const char* deviceId = "9b01775e-afc2-452f-8efe-ade0fafc9089"; // Thay bằng UUID từ Room.deviceId

WiFiClient espClient;
String roomId;

void setup() {
  Serial.begin(115200);
  mySerial.begin(57600, SERIAL_8N1, 16, 17);

  lcd.init();
  lcd.backlight();
  lcd.print("Fingerprint Sys");
  lcd.setCursor(0, 1);
  lcd.print("Starting...");

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n✅ WiFi Connected!");
  lcd.clear();
  lcd.print("WiFi Connected");

  if (finger.verifyPassword()) {
    Serial.println("✅ Kết nối AS608 thành công!");
  } else {
    Serial.println("❌ Không tìm thấy AS608!");
    lcd.setCursor(0, 1);
    lcd.print("AS608 Error");
    while (1);
  }

  roomId = getRoomIdFromDevice();
  if (roomId.length() == 0) {
    Serial.println("❌ Không tìm thấy phòng!");
    lcd.setCursor(0, 1);
    lcd.print("Room Error");
    while (1);
  }

  finger.emptyDatabase();
  syncFingerprints();
  lcd.clear();
  lcd.print("Ready");
}

void syncFingerprints() {
  HTTPClient http;
  String url = String(serverUrl) + "/api/fingerprint/sync";
  http.begin(url);
  int httpCode = http.GET();
  if (httpCode == 200) {
    String payload = http.getString();
    DynamicJsonDocument doc(2048);
    deserializeJson(doc, payload);
    JsonArray fingerprints = doc.as<JsonArray>();
    for (JsonObject fp : fingerprints) {
      String studentId = fp["studentId"].as<String>();
      String fingerprintData = fp["fingerprintTemplate"].as<String>(); // Đổi tên biến
      int id = finger.getTemplateCount() + 1;
      if (uploadTemplate(id, fingerprintData)) { // Đổi tên tham số
        Serial.println("✅ Đã đồng bộ vân tay ID: " + String(id) + " cho " + studentId);
      }
    }
  }
  http.end();
}

bool uploadTemplate(int id, String fingerprintData) { // Đổi tên tham số
  // Giả định: Đẩy fingerprintData (hex) vào AS608
  return finger.storeModel(id) == FINGERPRINT_OK; // Tạm dùng storeModel
}

String downloadTemplate(int id) {
    uint8_t packet[] = {0xEF, 0x01, 0xFF, 0xFF, 0xFF, 0xFF, 0x08, 0x00, 0x03, (uint8_t)id, 0x00, (uint8_t)(0x04 + id)};
    mySerial.write(packet, sizeof(packet));
    delay(100);
    String data = "";
    while (mySerial.available()) {
        char c = mySerial.read();
        data += String(c, HEX);
    }
    return data; // Chuỗi hex 512 byte
}

bool uploadTemplate(int id, String fingerprintData) {
    // Chuyển hex về nhị phân, gửi lệnh "Upload Template" (0x07)
    // Giả định tạm: Dùng finger.storeModel
    return finger.storeModel(id) == FINGERPRINT_OK;
}

void checkFingerprintRequest() {
  HTTPClient http;
  String url = String(serverUrl) + "/api/fingerprint/check-request";
  http.begin(url);
  int httpCode = http.GET();
  if (httpCode == 200) {
    String payload = http.getString();
    DynamicJsonDocument doc(1024);
    deserializeJson(doc, payload);
    String studentId = doc["studentId"].as<String>();
    if (studentId != "null" && studentId.length() > 0) {
      Serial.println("📌 Nhận yêu cầu đăng ký cho: " + studentId);
      lcd.clear();
      lcd.print("Register for");
      lcd.setCursor(0, 1);
      lcd.print(studentId.substring(0, 16));
      registerFingerprint(studentId);
    }
  }
  http.end();
}

void registerFingerprint(String studentId) {
  lcd.clear();
  lcd.print("Place finger");
  Serial.println("Đặt ngón tay...");
  int p = -1;
  while (p != FINGERPRINT_OK) {
    p = finger.getImage();
    if (p == FINGERPRINT_OK) break;
    delay(500);
  }

  p = finger.image2Tz(1);
  if (p != FINGERPRINT_OK) {
    Serial.println("❌ Lỗi chuyển đổi!");
    lcd.setCursor(0, 1);
    lcd.print("Error");
    delay(2000);
    lcd.clear();
    lcd.print("Ready");
    return;
  }

  lcd.clear();
  lcd.print("Remove finger");
  delay(2000);
  while (finger.getImage() != FINGERPRINT_NOFINGER);

  lcd.clear();
  lcd.print("Place again");
  p = -1;
  while (p != FINGERPRINT_OK) {
    p = finger.getImage();
    if (p == FINGERPRINT_OK) break;
    delay(500);
  }

  p = finger.image2Tz(2);
  if (p != FINGERPRINT_OK) {
    Serial.println("❌ Lỗi chuyển đổi lần 2!");
    lcd.setCursor(0, 1);
    lcd.print("Error");
    delay(2000);
    lcd.clear();
    lcd.print("Ready");
    return;
  }

  p = finger.createModel();
  if (p != FINGERPRINT_OK) {
    Serial.println("❌ Lỗi tạo mô hình!");
    lcd.setCursor(0, 1);
    lcd.print("Model Error");
    delay(2000);
    lcd.clear();
    lcd.print("Ready");
    return;
  }

  int id = finger.getTemplateCount() + 1;
  p = finger.storeModel(id);
  if (p == FINGERPRINT_OK) {
    Serial.printf("✅ Lưu vân tay với ID %d\n", id);
    lcd.clear();
    lcd.print("Stored ID: ");
    lcd.print(id);

    String fingerprintData = downloadTemplate(id); // Đổi tên biến
    if (fingerprintData.length() > 0) {
      HTTPClient http;
      String url = String(serverUrl) + "/api/fingerprint/register-fingerprint";
      http.begin(url);
      http.addHeader("Content-Type", "application/json");

      DynamicJsonDocument doc(1024);
      doc["studentId"] = studentId;
      doc["fingerprintTemplate"] = fingerprintData; // Đổi tên biến
      String payload;
      serializeJson(doc, payload);

      int httpCode = http.POST(payload);
      if (httpCode == 200) {
        Serial.println("✅ Đăng ký lên server thành công!");
        lcd.setCursor(0, 1);
        lcd.print("Server OK");
      } else {
        Serial.printf("❌ Lỗi đăng ký: %d\n", httpCode);
        lcd.setCursor(0, 1);
        lcd.print("Server Error");
      }
      http.end();
    }
  }
  delay(2000);
  lcd.clear();
  lcd.print("Ready");
}

String downloadTemplate(int id) {
  // Giả định: Trích xuất dữ liệu hex từ AS608
  return String(id); // Tạm trả về ID
}

void checkAttendance() {
  lcd.clear();
  lcd.print("Scan finger");
  Serial.println("📡 Quét vân tay để điểm danh...");

  int p = -1;
  while (p != FINGERPRINT_OK) {
    p = finger.getImage();
    if (p == FINGERPRINT_OK) break;
    delay(500);
  }

  p = finger.image2Tz();
  if (p != FINGERPRINT_OK) {
    Serial.println("❌ Lỗi chuyển đổi hình ảnh!");
    lcd.setCursor(0, 1);
    lcd.print("Scan Error");
    delay(2000);
    lcd.clear();
    lcd.print("Ready");
    return;
  }

  p = finger.fingerFastSearch();
  if (p == FINGERPRINT_OK) {
    int id = finger.fingerID;
    Serial.printf("✅ Tìm thấy vân tay với ID %d\n", id);
    lcd.clear();
    lcd.print("Found ID: ");
    lcd.print(id);

    String studentId = getStudentIdFromFingerprint(id);
    if (studentId.length() > 0) {
      HTTPClient http;
      String url = String(serverUrl) + "/api/attendance/check";
      http.begin(url);
      http.addHeader("Content-Type", "application/json");

      DynamicJsonDocument doc(1024);
      doc["student"] = studentId;
      doc["deviceId"] = deviceId;
      String payload;
      serializeJson(doc, payload);

      int httpCode = http.POST(payload);
      if (httpCode == 200 || httpCode == 201) {
        Serial.println("✅ Điểm danh thành công!");
        lcd.setCursor(0, 1);
        lcd.print(httpCode == 201 ? "Check-in OK" : "Check-out OK");
      } else {
        Serial.printf("❌ Lỗi điểm danh: %d\n", httpCode);
        lcd.setCursor(0, 1);
        lcd.print("Server Error");
      }
      http.end();
    } else {
      Serial.println("❌ Không tìm thấy sinh viên!");
      lcd.setCursor(0, 1);
      lcd.print("Student Not Found");
    }
  } else {
    Serial.println("❌ Không tìm thấy vân tay!");
    lcd.setCursor(0, 1);
    lcd.print("Not Found");
  }
  delay(2000);
  lcd.clear();
  lcd.print("Ready");
}

String getStudentIdFromFingerprint(int fingerprintId) {
  HTTPClient http;
  String url = String(serverUrl) + "/api/fingerprint/verify-fingerprint";
  http.begin(url);
  http.addHeader("Content-Type", "application/json");

  DynamicJsonDocument doc(1024);
  doc["fingerprintTemplate"] = String(fingerprintId);
  String payload;
  serializeJson(doc, payload);

  int httpCode = http.POST(payload);
  if (httpCode == 200) {
    String response = http.getString();
    DynamicJsonDocument resDoc(1024);
    deserializeJson(resDoc, response);
    return resDoc["student"]["studentId"].as<String>();
  } else {
    Serial.printf("❌ Lỗi xác thực: %d\n", httpCode);
    return "";
  }
  http.end();
}

String getRoomIdFromDevice() {
  HTTPClient http;
  String url = String(serverUrl) + "/api/rooms/get-by-device?deviceId=" + String(deviceId);
  http.begin(url);
  int httpCode = http.GET();
  if (httpCode == 200) {
    String payload = http.getString();
    DynamicJsonDocument doc(1024);
    deserializeJson(doc, payload);
    return doc["roomId"].as<String>();
  } else {
    Serial.printf("❌ Lỗi lấy roomId: %d\n", httpCode);
    return "";
  }
  http.end();
}

void loop() {
  checkFingerprintRequest();
  checkAttendance();
  delay(500);
}