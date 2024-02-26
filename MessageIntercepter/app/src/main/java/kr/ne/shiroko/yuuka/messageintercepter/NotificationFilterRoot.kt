package kr.ne.shiroko.yuuka.messageintercepter

class NotificationFilterRoot : NotificationFilter {
    private val packageNameMap = mapOf(
        NotificationFilterNaver.packageName to NotificationFilterNaver(),
        NotificationFilterSamsungPay.packageName to NotificationFilterSamsungPay(),
        NotificationFilterToss.packageName to NotificationFilterToss(),
        NotificationFilterKookminBank.packageName to NotificationFilterKookminBank(),
        NotificationFilterKBank.packageName to NotificationFilterKBank(),
    )

    // TODO: 어떤 패키지의 메세지가 관심있는지 확신이 생기기전까지는 denyList로 관리
    // 받아볼 목적이 정해지면 allowList로 바꾼다.
    private val denyList = hashSetOf<String>(
        "android",
        // email같은 시스템 알림
        "com.google.android.gm",
        "com.google.android.gms",
        "com.google.android.googlequicksearchbox",
        "com.google.android.calendar",
        "com.google.android.youtube",
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
        "com.nhn.android.webtoon",
        "com.samsung.android.themestore",
        "com.Slack",
        "com.android.chrome",
        "com.kt.olleh.storefront",
        "com.sec.android.app.clockpackage",
        "com.samsung.android.app.cocktailbarservice",
        "com.samsung.android.voc",
        "com.samsung.android.themestore",
        "com.samsung.android.oneconnect",
        "com.samsung.android.messaging",
        "com.samsung.android.app.cocktailbarservice",
        "com.soundcloud.android",
        "gogolook.callgogolook2",
    )

    override fun predicate(data: MyNotification): Boolean {
        val packageName = data.packageName

        if (denyList.contains(packageName)) {
            return false
        }

        if (data.title == null) return false
        if (data.title == "") return false

        val packageFilter = packageNameMap[packageName]
        return packageFilter?.predicate(data) ?: true
    }
}
