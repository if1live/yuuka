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

    // TODO: 어떤 패키지의 메세지가 관심있는지 확신이 생기기전까지는 denyList로 관리
    // 받아볼 목적이 정해지면 allowList로 바꾼다.
    val denyList = hashSetOf<String>(
        "android",
        // email같은 시스템 알림
        "com.google.android.gm",
        "com.google.android.googlequicksearchbox",
        "com.kakao.talk",
        // 무선 충전
        "com.android.systemui",
        "com.sec.android.app.shealth",
        "com.sec.android.daemonapp",
        "com.discord",
        "com.teamblind.blind",
        "com.twitter.android",
        "com.samsung.android.app.tips",
        "hotspotshield.android.vpn",
        "kr.co.burgerkinghybrid",
        "kr.pe.designerj.airbudspopup.free",
        "com.heavenburnsred",
        "com.microsoft.office.outlook",
    )

    private val packageNameMap = mapOf(
        NotificationFilterNaver.packageName to NotificationFilterNaver(),
        NotificationFilterSamsungPay.packageName to NotificationFilterSamsungPay(),
        NotificationFilterToss.packageName to NotificationFilterToss(),
        NotificationFilterKBank.packageName to NotificationFilterKBank(),
    )

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
        val key: String = sbn?.key ?: "Null"
        val id: Int = sbn?.id ?: -1
        val postTime: Long = sbn?.postTime ?: -1;
        val extras = sbn?.notification?.extras

        if (denyList.contains(packageName)) {
            // Log.d(TAG, "onNotificationPosted: $packageName in denyList")
            return
        }

        if (extras == null) {
            return
        }

        // https://developer.android.com/reference/android/app/Notification 필요하면 뒤져서 더 뜯기
        val extraTitle = extras.getString(Notification.EXTRA_TITLE)
        val extraText = extras.getString(Notification.EXTRA_TEXT)
        val extraBigText = extras.getString(Notification.EXTRA_BIG_TEXT)
        val extraInfoText = extras.getString(Notification.EXTRA_INFO_TEXT)
        val extraSubText = extras.getString(Notification.EXTRA_SUB_TEXT)
        val extraSummaryText = extras.getString(Notification.EXTRA_SUMMARY_TEXT)

        val data = MyNotification(id)
        data.title = extraTitle
        data.text = extraText
        data.bigText = extraBigText
        data.infoText = extraInfoText
        data.subText = extraSubText
        data.summaryText = extraSummaryText

        val packageFilter = packageNameMap[packageName]
        val required = packageFilter?.predicate(data) ?: true
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

        // TODO: 관심있는 패키지에서 발생한 항목만 전달해야한다.
        val json = JSONObject()
        // StatusBarNotification
        json.put("id", id)
        json.put("key", key)
        json.put("postTime", postTime)
        json.put("packageName", packageName)

        // extras
        val jsonExtra = JSONObject()
        jsonExtra.put("title", extraTitle)
        jsonExtra.put("text", extraText)
        jsonExtra.put("bigText", extraBigText)
        jsonExtra.put("infoText", extraInfoText)
        jsonExtra.put("subText", extraSubText)
        jsonExtra.put("summaryText", extraSummaryText)

        json.put("extras", jsonExtra)

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
