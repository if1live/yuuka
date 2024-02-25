package kr.ne.shiroko.yuuka.messageintercepter

import android.app.Notification
import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.util.Log
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import org.json.JSONObject
import java.util.concurrent.CopyOnWriteArrayList

// https://devjaewoo.tistory.com/54
class MyNotificationListenerService : NotificationListenerService() {
    private val TAG = "MyNotificationListenerService"

    // private val notificationKeyList = CopyOnWriteArrayList<String>()

    // TODO: 주소 수정
    // private val url = "http://192.168.0.103:3000/messages/"
    private val url = "https://9skmgzitgk.execute-api.ap-northeast-1.amazonaws.com/messages/"
    private val sender = MessageSender(url)

    private val packageFilter = NotificationFilterRoot()

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

        if (sbn == null) {
            return
        }

        val data = MyNotification(sbn.packageName)
        data.fill(sbn)

        val required = packageFilter.predicate(data)
        if (!required) {
            return
        }

        /*
        // TODO: 삼성페이의 경우, 다른 결제인데 같은 key로 보내는 경우가 있다.
        // extras의 내용도 검증에서 써야할듯
        // 똑같은 메세지로 onNotificationPosted가 2번 호출되는 경우가 있다.
        // "A unique instance key for this notification record."인 key를 사용해서 중복 제거
        val found = notificationKeyList.indexOf(key);
        if (found >= 0) {
            // Log.d(TAG, "onNotificationPosted: $key is duplicated notification")
            return
        }

        notificationKeyList.add(key)
        if (notificationKeyList.count() >= 100)
            notificationKeyList.removeFirst()
         */

        val json = data.toJson()
        val jsonText = json.toString(2)
        Log.d(TAG, "onNotificationPosted:\n$jsonText")

        // kotlin 비동기 어떻게 쓰는거지?
        val myScope = CoroutineScope(Dispatchers.Default)
        myScope.launch {
            // 여기서 suspend 함수를 호출
            sender.sendMessage(json)
        }
    }
}
