from django import forms
from django.contrib.auth.models import User
from core.models import UserProfile

class UserProfileForm(forms.ModelForm):
    class Meta:
        model = UserProfile
        fields = ['mobile']

    def clean_mobile(self):
        mobile = self.cleaned_data['mobile']
        if mobile and not mobile.isdigit():
            raise forms.ValidationError("Invalid mobile number")
        if UserProfile.objects.filter(mobile=mobile):
            raise forms.ValidationError("This number already exist")


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

    def clean_email(self):
        email = self.cleaned_data['email']
        if email and User.objects.filter(email=email):
            raise forms.ValidationError("Email address already exist")
        elif not email:
            raise forms.ValidationError("This field required")
        return email


