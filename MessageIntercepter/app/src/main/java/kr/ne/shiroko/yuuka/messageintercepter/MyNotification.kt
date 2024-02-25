package kr.ne.shiroko.yuuka.messageintercepter

/**
 * android.os.Bundle를 유닛테스트에서 생성할 수 없다.
 * 적당히 필요한 정보만 넣어서 들고다니기
 */
data class MyNotification(val id: Int) {
    var title: String? = null
    var text: String? = null
    var bigText: String? = null
    var infoText: String? = null
    var subText: String? = null
    var summaryText: String? = null
}
