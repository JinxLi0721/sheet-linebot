# sheet-linebot
### 使用line即可紀錄電表數字，並將資料存於google sheet，供紀錄即可自我分析耗電用品，掌握用電量
#####
![image](https://github.com/JinxLi0721/sheet-linebot/assets/61728989/7d1a99f8-3cbd-4ca7-97f1-bb78f4ecc409)
- 使用方式：
  1. **有照片**：拍下電表上傳照片，會於img這個表紀錄上傳圖片的時間，第二條訊息再輸入電表數字(因為平日出門要打數字太花時間，直接拍照上傳，有空再看數字多少，**輸入數字時會抓取上傳圖片的時間紀錄**)
  2. **無照片**：直接輸入數字，**需於數字前加上n**供程式分辨(會抓取輸入數字的當下時間)
  3. 若需要增加該項紀錄的說明，送出電表數字後，再輸入文字備註![image](https://github.com/JinxLi0721/sheet-linebot/assets/61728989/669397e0-3029-47e5-8c59-b585a9620497)
- 上傳時間在晚上 17:00後5:00前，該列會呈現藍綠色；5:00~17:00 會呈現黃色
- 上傳數字後，會回覆與上筆電表數字相差幾度電
- 不可累計，若上傳完圖片，需於下次上傳圖片/數字前，輸入完此次的電表數字

# 建立方式
## 擁有一個Line商用帳號
1. 創建channels，去到Messaging API取得Channel access token(請參考其他人撰寫的申請步驟)
2. webhook 設定方式如下，Webhook URL 為待會部署完成後的網址，目前先不用設置：
  ![image](https://github.com/JinxLi0721/sheet-linebot/assets/61728989/eaa253e3-fccc-4572-8a95-adf0d547f5c2)
3. 於個人Line加入此商用帳號(會於Messaging API settings看到QRcode，掃描加入)

## 新增一個google sheet
1. 在Google雲端新增一個試算表
2. 第一個表命名為"elector"
3. 新增第二個表命名為"img"
4. 於elector的表，第一列新增標題並凍結![image](https://github.com/JinxLi0721/sheet-linebot/assets/61728989/6fd5186f-012b-4ff0-a450-88b785931d14)


## App script
1. 在[這裡script](https://script.google.com/) 按下「新專案」
2. 複製[doPost.js](https://github.com/JinxLi0721/sheet-linebot/blob/main/doPost.js)的程式碼貼上
3. 在line剛剛創建的channels裡的Messaging API 複製Channel access token，貼到程式中的`CHANNEL_ACCESS_TOKEN`這個變數後面的引號內![image](https://github.com/JinxLi0721/sheet-linebot/assets/61728989/0055350c-0457-44ec-be29-184f25b0bff3)
4. 複製剛剛新增的試算表網址，貼到程式中的`SpreadsheetApp.openByUrl("sheetUrl")`取代`sheetUrl`
5. 儲存 -> 部屬 -> 新增部屬作業![image](https://github.com/JinxLi0721/sheet-linebot/assets/61728989/098f65b7-10af-49bd-a81c-49ed37c4de67)
6. 說明可不填，用於備註不同部屬版本；「誰可以存取」選擇「所有人」-> 部屬 ![image](https://github.com/JinxLi0721/sheet-linebot/assets/61728989/5385db9c-d267-4d1f-b8f7-6318ee0db671)
7. 複製部屬完成的網址，貼到Line Messaging API - Webhook URL -> update

## 個人化設置



# Reference
- [做個 LINE 機器人記錄誰 +1！群組 LINE Bot 製作教學與分享](https://jcshawn.com/addone-linebot/)
- [Google 試算表 (1) - 讀取試算表資訊](https://www.oxxostudio.tw/articles/201706/google-spreadsheet-1.html)
- [兩小時打造簡單 Line Chatbot — 使用 Google Apps Script & Google Sheet API](https://medium.com/技術筆記/兩小時打造簡單-line-chatbot-使用-google-apps-script-google-sheet-api-8fff7372ff3d)
- [Messaging API reference-Webhook Event Objects](https://developers.line.biz/en/reference/messaging-api/#webhook-event-objects)
- [App script-Class Sheet](https://developers.google.com/apps-script/reference/spreadsheet/sheet?hl=zh-tw#getRange(Integer,Integer))
- [App script-Class Range](https://developers.google.com/apps-script/reference/spreadsheet/range?hl=zh-tw#setbackgroundcolor)
