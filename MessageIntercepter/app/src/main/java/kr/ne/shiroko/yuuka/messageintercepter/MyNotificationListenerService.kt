package kr.ne.shiroko.yuuka.messageintercepter

import android.app.Notification
import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.util.Log
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import org.json.JSONObject

// https://devjaewoo.tistory.com/54
class MyNotificationListenerService : NotificationListenerService() {
    private val TAG = "MyNotificationListenerService"

    // TODO: 주소 수정
    private var url = "http://192.168.0.103:3000/messages/"
    private val sender = MessageSender(url)

    override fun onListenerConnected() {
        super.onListenerConnected()
        Log.e(TAG, "MyNotificationListener.onListenerConnected()")
    }

    override fun onListenerDisconnected() {
        super.onListenerDisconnected()
        Log.e(TAG, "MyNotificationListener.onListenerDisconnected()")
    }

    override fun onNotificationPosted(sbn: StatusBarNotification?) {
        super.onNotificationPosted(sbn)

        val packageName: String = sbn?.packageName ?: "Null"
        val extras = sbn?.notification?.extras

        // https://developer.android.com/reference/android/app/Notification 필요하면 뒤져서 더 뜯기
        val extraTitle = extras?.getString(Notification.EXTRA_TITLE)
        val extraText = extras?.getString(Notification.EXTRA_TEXT)
        val extraBigText = extras?.getString(Notification.EXTRA_BIG_TEXT)
        val extraInfoText = extras?.getString(Notification.EXTRA_INFO_TEXT)
        val extraSubText = extras?.getString(Notification.EXTRA_SUB_TEXT)
        val extraSummaryText = extras?.getString(Notification.EXTRA_SUMMARY_TEXT)

        Log.d(
            TAG, "onNotificationPosted:\n" +
                "PackageName: $packageName" +
                "Title: $extraTitle\n" +
                "Text: $extraText\n" +
                "BigText: $extraBigText\n" +
                "InfoText: $extraInfoText\n" +
                "SubText: $extraSubText\n" +
                "SummaryText: $extraSummaryText\n"
        )

        // TODO: 관심있는 패키지에서 발생한 항목만 전달해야한다.
        val json = JSONObject()
        json.put("packageName", packageName)
        json.put("title", extraTitle)
        json.put("text", extraText)
        json.put("bigText", extraBigText)
        json.put("infoText", extraInfoText)
        json.put("subText", extraSubText)
        json.put("summaryText", extraSummaryText)

        // kotlin 비동기 어떻게 쓰는거지?
        val myScope = CoroutineScope(Dispatchers.Default)
        myScope.launch {
            // 여기서 suspend 함수를 호출
            sender.sendMessage(json)
        }

    }
}
