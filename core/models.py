from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    # This line is required. Links UserProfile to a User model instance.
    user = models.OneToOneField(User)
    # The additional attributes we wish to include.
    mobile = models.CharField(max_length=15,blank=True,null=True)

    # Override the __unicode__() method to return out something meaningful!
    def __unicode__(self):
        return self.user.username

class Message(models.Model):

    message = models.CharField(max_length=500,blank=False,null=False)
    created_on = models.DateTimeField(auto_now_add=True)
    msg_from = models.ForeignKey(User,to_field='username',related_name='user_reated_to_msg_from')
    msg_to = models.ForeignKey(User,to_field='username' ,related_name='user_reated_to_msg_to')
    is_delivered = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    def __unicode__(self):
        return "From:%s To:%s On:%s"%(self.msg_from,self.msg_to,str(self.created_on))
