#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <Adafruit_Fingerprint.h>
#include <Wire.h>
#include <LCDI2C_Multilingual.h>

LCDI2C_Vietnamese lcd(0x27, 16, 2);
HardwareSerial mySerial(2);
Adafruit_Fingerprint finger = Adafruit_Fingerprint(&mySerial);

const char* ssid = "TP-LINK_A1CB";
const char* password = "12341234";
const char* serverUrl = "http://192.170.32.102:5000";
const char* deviceId = "16497161-e978-4244-9228-ffe0a01c12fd";

void setup() {
  Serial.begin(115200);
  mySerial.begin(57600, SERIAL_8N1, 16, 17);

  lcd.init();
  lcd.backlight();
  lcd.print("Starting...");

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi Connected");
  lcd.clear();
  lcd.print("WiFi OK");

  if (!finger.verifyPassword()) {
    Serial.println("AS608 Error");
    lcd.setCursor(0, 1);
    lcd.print("AS608 Error");
    while (1);
  }
  Serial.println("AS608 OK");
  lcd.clear();
  lcd.print("Ready");
}

// Hàm mới: Lấy ID tiếp theo từ server
int getNextIdFromServer() {
  HTTPClient http;
  String url = String(serverUrl) + "/api/fingerprint/next-id?deviceId=" + String(deviceId);
  http.begin(url);
  http.setTimeout(5000);
  int httpCode = http.GET();
  
  if (httpCode == 200) {
    String payload = http.getString();
    DynamicJsonDocument doc(1024);
    deserializeJson(doc, payload);
    int nextId = doc["nextId"].as<int>();
    Serial.print("Next ID from server: ");
    Serial.println(nextId);
    http.end();
    return nextId;
  } else {
    Serial.println("Failed to get next ID from server: " + String(httpCode));
    http.end();
    return -1; // Trả về -1 nếu lỗi
  }
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    checkFingerprintRequest();
    checkDeleteFingerprintRequest();
    checkAttendance();
  } else {
    lcd.clear();
    lcd.print("WiFi Lost");
    WiFi.reconnect();
    delay(2000);
  }
  delay(100);
}

//  Kiểm tra từ server xem có yêu cầu đăng ký vân tay nào không
void checkFingerprintRequest() {
  HTTPClient http;
  String url = String(serverUrl) + "/api/fingerprint/check-request?deviceId=" + String(deviceId);
  http.begin(url);
  http.setTimeout(5000);
  int httpCode = http.GET();
  if (httpCode == 200) {
    String payload = http.getString();
    DynamicJsonDocument doc(1024);
    deserializeJson(doc, payload);
    String studentId = doc["studentId"].as<String>();
    if (studentId != "null" && studentId.length() > 0) {
      Serial.println("Register: " + studentId);
      lcd.clear();
      lcd.print("Register");
      lcd.setCursor(0, 1);
      lcd.print(studentId.substring(0, 16));
      registerFingerprint(studentId);
    }
  } else {
    Serial.println("Check-request failed: " + String(httpCode));
  }
  http.end();
}

// Đăng ký dấu vân tay mới
void registerFingerprint(String studentId) {
  Serial.setTimeout(100); // Đặt timeout cho Serial là 100ms

  lcd.clear();
  lcd.print("Place finger");
  int p = -1;
  while (p != FINGERPRINT_OK) {
    p = finger.getImage();
    if (Serial.available()) {
      String input = Serial.readStringUntil('\n'); // Đọc đến ký tự xuống dòng
      input.trim(); // Loại bỏ khoảng trắng hoặc ký tự thừa
      if (input == "cancel") {
        lcd.clear();
        lcd.print("Canceled");
        delay(2000);
        lcd.clear();
        lcd.print("Ready");
        while (Serial.available()) Serial.read(); // Xóa buffer
        return;
      }
    }
    delay(50); // Giảm delay để kiểm tra Serial thường xuyên hơn
  }

  p = finger.image2Tz(1);
  if (p != FINGERPRINT_OK) {
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
    if (Serial.available()) {
      String input = Serial.readStringUntil('\n');
      input.trim();
      if (input == "cancel") {
        lcd.clear();
        lcd.print("Canceled");
        delay(2000);
        lcd.clear();
        lcd.print("Ready");
        while (Serial.available()) Serial.read(); // Xóa buffer
        return;
      }
    }
    delay(50); // Giảm delay
  }

  p = finger.image2Tz(2);
  if (p != FINGERPRINT_OK) {
    lcd.setCursor(0, 1);
    lcd.print("Error");
    delay(2000);
    lcd.clear();
    lcd.print("Ready");
    return;
  }

  p = finger.createModel();
  if (p != FINGERPRINT_OK) {
    lcd.setCursor(0, 1);
    lcd.print("Model Error");
    delay(2000);
    lcd.clear();
    lcd.print("Ready");
    return;
  }

  int id = getNextIdFromServer();
  if (id <= 0) {
    lcd.setCursor(0, 1);
    lcd.print("Server ID Error");
    delay(2000);
    lcd.clear();
    lcd.print("Ready");
    return;
  }

  p = finger.storeModel(id);
  if (p == FINGERPRINT_OK) {
    lcd.clear();
    lcd.print("Stored ID: ");
    lcd.print(id);
    sendFingerprintIdToServer(studentId, id);
  } else {
    lcd.setCursor(0, 1);
    lcd.print("Store Error");
    Serial.print("Store failed with code: ");
    Serial.println(p);
  }
  delay(2000);
  lcd.clear();
  lcd.print("Ready");
}

// Gửi thông tin ID vân tay của sinh viên lên server
void sendFingerprintIdToServer(String studentId, int fingerprintId) {
  HTTPClient http;
  String url = String(serverUrl) + "/api/fingerprint/register-fingerprint";
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  http.setTimeout(4000);

  DynamicJsonDocument doc(1024);
  doc["studentId"] = studentId;
  doc["fingerprintId"] = fingerprintId;
  doc["deviceId"] = deviceId;
  String payload;
  serializeJson(doc, payload);

  int httpCode = http.POST(payload);
  if (httpCode == 200) {
    lcd.setCursor(0, 1);
    lcd.print("Success");
  } else {
    lcd.setCursor(0, 1);
    lcd.print("Server Error");
  }
  http.end();
}

// Kiểm tra từ server xem có yêu cầu xóa vân tay nào không và xóa
void checkDeleteFingerprintRequest() {
  HTTPClient http;
  String url = String(serverUrl) + "/api/fingerprint/check-delete?deviceId=" + String(deviceId);
  http.begin(url);
  http.setTimeout(4000);
  int httpCode = http.GET();
  if (httpCode == 200) {
    String payload = http.getString();
    DynamicJsonDocument doc(1024);
    deserializeJson(doc, payload);
    int fingerprintId = doc["fingerprintId"].as<int>();
    if (fingerprintId > 0) {
      lcd.clear();
      lcd.print("Deleting ID: ");
      lcd.print(fingerprintId);
      int p = finger.deleteModel(fingerprintId);
      if (p == FINGERPRINT_OK) {
        lcd.setCursor(0, 1);
        lcd.print("Deleted");
      } else {
        lcd.setCursor(0, 1);
        lcd.print("Delete Error");
      }
      delay(2000);
      lcd.clear();
      lcd.print("Ready");
    }
  }
  http.end();
}

// Kiểm tra vân tay để điểm danh
void checkAttendance() {
  lcd.clear();
  lcd.print("Scan finger");
  int p = -1;
  unsigned long startTime = millis();
  while (p != FINGERPRINT_OK && millis() - startTime < 10000) {
    p = finger.getImage();
    delay(100);
  }
  if (p != FINGERPRINT_OK) {
    return;
  }

  p = finger.image2Tz();
  if (p != FINGERPRINT_OK) {
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
    lcd.clear();
    lcd.print("Found ID: ");
    lcd.print(id);
    String studentId = getStudentIdFromFingerprint(id);
    if (studentId.length() > 0) {
      sendAttendanceToServer(studentId);
    } else {
      lcd.setCursor(0, 1);
      lcd.print("Not Found");
    }
  } else {
    lcd.setCursor(0, 1);
    lcd.print("Not Found");
  }
  delay(2000);
  lcd.clear();
  lcd.print("Ready");
}

// Gửi fingerprintId để lấy StudentId
String getStudentIdFromFingerprint(int fingerprintId) {
  HTTPClient http;
  String url = String(serverUrl) + "/api/fingerprint/verify-fingerprint";
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  http.setTimeout(2000);

  DynamicJsonDocument doc(1024);
  doc["fingerprintId"] = fingerprintId;
  doc["deviceId"] = deviceId;
  String payload;
  serializeJson(doc, payload);

  int httpCode = http.POST(payload);
  if (httpCode == 200) {
    String response = http.getString();
    DynamicJsonDocument resDoc(1024);
    deserializeJson(resDoc, response);
    return resDoc["studentId"].as<String>();
  }
  return "";
}

// Gửi dữ liệu điểm danh
void sendAttendanceToServer(String studentId) {
  HTTPClient http;
  String url = String(serverUrl) + "/api/attendance/check";
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  http.setTimeout(2000);

  DynamicJsonDocument doc(1024);
  doc["studentId"] = studentId;
  doc["deviceId"] = deviceId;
  String payload;
  serializeJson(doc, payload);

  int httpCode = http.POST(payload);
  if (httpCode == 200 || httpCode == 201) {
    lcd.setCursor(0, 1);
    lcd.print(httpCode == 201 ? "Check-in" : "Check-out");
  } else {
    lcd.setCursor(0, 1);
    lcd.print("Error");
  }
  http.end();
}