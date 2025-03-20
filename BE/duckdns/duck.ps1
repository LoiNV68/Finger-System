$url = "https://www.duckdns.org/update?domains=finger-system&token=aa531e6a-5f4c-47bd-88f6-cfa9d4f9f4e7&ip="
$response = Invoke-WebRequest -Uri $url -Method Get -UseBasicParsing

# Xác định đường dẫn file log trong cùng thư mục với script
$logPath = "$PSScriptRoot\duck.log"

# Ghi nội dung phản hồi vào file log
$response.Content | Out-File -FilePath $logPath -Append -Encoding UTF8

