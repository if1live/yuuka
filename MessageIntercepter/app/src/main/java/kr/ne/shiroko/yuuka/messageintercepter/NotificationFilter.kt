package kr.ne.shiroko.yuuka.messageintercepter

interface NotificationFilter {
    fun predicate(data: MyNotification): Boolean
}
