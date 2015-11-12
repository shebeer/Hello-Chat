from django import forms
from django.contrib.auth.models import User
from core.models import UserProfile

__author__ = 'shah'

class UserProfileForm(forms.ModelForm):
    class Meta:
        model = UserProfile
        fields = ['mobile']

class UserForm(forms.ModelForm):

    confirm_pwd = forms.CharField(min_length=6,max_length=20,label="Confirm Password",required=True)
    password = forms.CharField(min_length=6,max_length=20,label="Password",required=True)
    class Meta:
        model = User
        fields = ['username','password','confirm_pwd','email']

    def clean_confirm_pwd(self):
        pwd1 = self.cleaned_data['password']
        pwd2 = self.cleaned_data['confirm_pwd']

        if not pwd1 == pwd2 :
            raise forms.ValidationError("The passwords don't match.")
