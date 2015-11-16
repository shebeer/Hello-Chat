import json
import datetime
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import View
from core.forms import UserForm,UserProfileForm
from core.models import UserProfile, Message
from django.contrib.auth.models import User
from django.contrib.sessions.models import Session
from django.utils import timezone

def get_all_logged_in_friends(user_id):
    # Query all non-expired sessions
    # use timezone.now() instead of datetime.now() in latest versions of Django
    sessions = Session.objects.filter(expire_date__gte=timezone.now())
    uid_list = []

    # Build a list of user ids from that query
    for session in sessions:
        data = session.get_decoded()
        uid_list.append(data.get('_auth_user_id', None))

    # Query all logged in users based on id list
    result = {
        'online_users': UserProfile.objects.filter(user__id__in=uid_list).exclude(user__id=user_id),
        'offline_users' : UserProfile.objects.exclude(Q(user__id__in=uid_list) | Q(user__id=user_id))
    }
    return result

@login_required
def home(request):
    return render(request, 'index.html')

class Registration(View):

    def get(self,request):
        context = {
            'user_profile_form':UserProfileForm(),
            'user_form': UserForm()
        }
        return render(request,'registration/registration.html',context)

    def post(self,request):

        data = request.POST
        user_form = UserForm(data=data)
        user_profile_form = UserProfileForm(data=data)
        if user_form.is_valid() and user_profile_form.is_valid():

            user_object = user_form.save(commit=False)
            user_object.set_password(user_object.password)
            user_object.save()

            user_prof_object = user_profile_form.save(commit=False)
            user_prof_object.user = user_object
            user_prof_object.save()

            return HttpResponseRedirect('/accounts/login/?message=Registration successfull, Please login with your credentials')
        context = {
            'user_profile_form':user_profile_form,
            'user_form': user_form
        }
        return render(request,'registration/registration.html',context)

#ajax functions

def fetch_friends(request,user_id):

    users = get_all_logged_in_friends(user_id)
    online_users = [{'username' : x.user.username,'id':x.user.id, 'new_msg_count':Message.objects.filter(msg_to__id=user_id,is_delivered=False,msg_from__id=x.user.id).count()} for x in users['online_users']]
    offline_users = [{'username' : x.user.username,'id':x.user.id, 'new_msg_count':Message.objects.filter(msg_to__id=user_id,is_delivered=False,msg_from__id=x.user.id).count()} for x in users['offline_users']]
    result = {
        'online_users' : online_users,
        'offline_users':offline_users
    }
    return HttpResponse(json.dumps(result),content_type='application/json')


def fetch_new_messages(request,from_id,user_id):

    print user_id
    messages = Message.objects.filter(msg_to__id=user_id,is_delivered=False,msg_from__id=from_id)
    result = [{'from_id':x.msg_from.id,'from_name':x.msg_from.username,'message':x.message,'time':x.created_on.strftime("%I:%M %p   %d, %b  %Y")} for x in messages]
    messages.update(is_delivered=True)
    return HttpResponse(json.dumps(result),content_type='application/json')

def fetch_old_messages(request,from_id,page):

    msgs_per_page = 20
    user_id  = request.user.id
    messages = Message.objects.filter(Q(msg_from__id=from_id,msg_to__id=user_id) | Q(msg_from__id=user_id,msg_to__id=from_id)).order_by('created_on')
    messages.update(is_delivered=True)
    messages = messages[(int(page)-1)*int(msgs_per_page):int(page)*int(msgs_per_page)]
    result = [{'from_id':x.msg_from.id,'from_name':x.msg_from.username,'message':x.message,'time':x.created_on.strftime("%I:%M %p   %d, %b  %Y")} for x in messages]
    return HttpResponse(json.dumps(result),content_type='application/json')

@csrf_exempt
def post_new_message(request):

    data = request.POST
    to_id = data.get('to',0)
    message = data.get('message',None)
    try:
        to_user = User.objects.get(id=to_id)
    except User.DoesNotExist:
        to_user = None
    if to_user and message:
        message_obj = Message(message=message,msg_from=request.user,msg_to=to_user)
        message_obj.save()
        result = {'from_id':message_obj.msg_from.id,'from_name':message_obj.msg_from.username,'message':message_obj.message,'time':str(message_obj.created_on.strftime("%I:%M %p   %d, %b  %Y"))}
    return HttpResponse(json.dumps(result),content_type='application/json')



