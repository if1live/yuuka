package kr.ne.shiroko.yuuka.messageintercepter

class NotificationFilterNaver : NotificationFilter {
    companion object {
        const val packageName = "com.nhn.android.search"
    }

    override fun predicate(data: MyNotification): Boolean {
        val title = data.title
        return !(title == null || title == "")
    }
}
