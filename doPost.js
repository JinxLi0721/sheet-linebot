function doPost(e) {
    // LINE Messenging API Token
    const CHANNEL_ACCESS_TOKEN =
        "TOKEN"; // 引號內放你的 LINE BOT Access Token
    // 以 JSON 格式解析 User 端傳來的 e 資料
    const msg = JSON.parse(e.postData.contents);

    // 從接收到的訊息中取出 replyToken 和發送的訊息文字，詳情請看 LINE 官方 API 說明文件
    const replyToken = msg.events[0].replyToken; // 回覆的 token
    const user_id = msg.events[0].source.userId; // 抓取使用者的 ID，等等用來查詢使用者的名稱
    const event_type = msg.events[0].source.type; // 分辨是個人聊天室還是群組
    const msgType = msg.events[0].message.type;// 分辨訊息是圖片或是文字等等類型
    const num = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];//用來辨別傳來的訊息是否為數字
    let userMessage, replyMsg;

    const ss = SpreadsheetApp.openByUrl(
        "sheetUrl"
    ); //放要存入資料的雲端試算表連結
    const sheet = ss.getSheetByName("elector"); //表單名稱
    const sheetImg = ss.getSheetByName("img");
    try {
        if (msgType == "image") {
            let date = Utilities.formatDate(new Date(), "Asia/Taipei", "yyyy-MM-dd HH:mm");
            sheetImg.appendRow([date]);
            replyMsg = date;
        } else if (msgType == "text") {
            userMessage = msg.events[0].message.text; // 抓取使用者傳的訊息內容
            let imgRow = sheetImg.getLastRow();
            let imgDate = sheetImg.getSheetValues(imgRow, 1, 1, 1);// 抓取上傳圖片的時間
            let date = Utilities.formatDate(new Date(), "Asia/Taipei", "yyyy-MM-dd HH:mm");
            let userMsgArray = Array.from(userMessage);

            userMsgArray.every((v) => {
                if (num.includes(v)) {// 如果傳的是數字，抓取另一個存圖片時間的sheet
                    let yesterdayData = sheet.getSheetValues(sheet.getLastRow(), 2, 1, 1);
                    let minus = parseFloat(userMessage) - parseFloat(yesterdayData);
                    sheet.appendRow([imgDate[0][0], userMessage, minus]);
                    let hour = Utilities.formatDate(imgDate[0][0], "Asia/Taipei", "HH");// 用來辨別現在上傳的時間要用什麼背景顏色
                    let colorRange = sheet.getRange(sheet.getLastRow(), 1, 1, 4);
                    setColor(hour, colorRange);
                    replyMsg = "花費" + minus + "度電";
                    return false;
                } else {
                    if (v == "n") {//無照片，存入當前時間，手key數字，透過n來分辨 ex. n31324.7
                        let yesterdayData = sheet.getSheetValues(sheet.getLastRow(), 2, 1, 1);
                        let nUserMsg = userMessage.slice(1);
                        let minus = parseFloat(nUserMsg) - parseFloat(yesterdayData);
                        sheet.appendRow([date, nUserMsg, minus]);
                        let hour = Utilities.formatDate(new Date(), "Asia/Taipei", "HH");
                        let colorRange = sheet.getRange(sheet.getLastRow(), 1, 1, 4);
                        setColor(hour, colorRange);
                        replyMsg = "花費" + minus + "度電";
                        return false;
                    }
                    //輸入中文，當作此次紀錄的備註
                    let textLastRow = sheet.getLastRow();
                    let psRange = sheet.getRange(textLastRow, 4);
                    psRange.setValue(userMessage);
                    psRange.color;
                    replyMsg = "textLastRow:" + textLastRow;
                    return false;
                }
            });
        }
        replyMsg += ";上傳成功";
    } catch (e) {
        replyMsg = "上傳失敗:" + JSON.stringify(e) + e;
    }

    // reply_messgae 為要回傳給 LINE 伺服器的內容，JSON 格式，詳情可看 LINE 官方 API 說明
    var reply_message = [
        {
            type: "text",
            text: replyMsg
        }
    ];

    //回傳 JSON 給 LINE 並傳送給使用者
    let url = "https://api.line.me/v2/bot/message/reply";
    try {
        UrlFetchApp.fetch(url, {
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
                Authorization: "Bearer " + CHANNEL_ACCESS_TOKEN
            },
            method: "post",
            payload: JSON.stringify({
                replyToken: replyToken,
                messages: reply_message
            })
        });
    } catch (e) {
        Logger.log(JSON.stringify(e));
    }
    function setColor(hour, colorRange) {
        if (hour >= 17 && hour <= 4) { // 下午五點到凌晨四點前
            let colors = [
                ["#c4e1e1", "#c4e1e1", "#c4e1e1", "#c4e1e1"] // These are the hex equivalents
            ];
            colorRange.setBackgrounds(colors);
        } else {
            let colors = [
                ["#fff2cc", "#fff2cc", "#fff2cc", "#fff2cc"] // These are the hex equivalents
            ];
            colorRange.setBackgrounds(colors);
        }
    }
}
