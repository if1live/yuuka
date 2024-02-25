package kr.ne.shiroko.yuuka.messageintercepter

class NotificationFilterToss : NotificationFilter {
    companion object {
        const val packageName = "viva.republica.toss"
    }

    override fun predicate(data: MyNotification): Boolean {
        val title = data.title
        if (title == null) return false
        if (title == "") return false
        if (title == "근처에 토스를 켠 사람이 있어요!") return false

        val subText = data.subText
        if (subText == "만보기") return false

        return true
    }
}
