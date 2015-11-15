from django.conf.urls import include, url
from core import views

urlpatterns = [
    url(r'^fetch/friends/(\d+)/$','core.views.fetch_friends',name='fetch_friends'),
    url(r'^fetch/new/messages/from/(\d+)/to/(\d+)/$','core.views.fetch_new_messages',name='fetch_new_messages'),
    url(r'^fetch/old/messages/from/(\d+)/page/(\d+)/$','core.views.fetch_old_messages',name='fetch_old_messages'),
    url(r'^post/new/message/$','core.views.post_new_message',name='post_message'),
]
