from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.views.generic import View
from core.forms import UserForm,UserProfileForm

@login_required
def home(request):
    return render(request,'index.html')

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

