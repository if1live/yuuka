package kr.ne.shiroko.yuuka.messageintercepter

class NotificationFilterKBank : NotificationFilter {
    companion object {
        const val packageName = "com.kbankwith.smartbank"
    }

    override fun predicate(data: MyNotification): Boolean {
        return true
    }
}
