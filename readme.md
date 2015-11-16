# HelloChat

HelloChat is a minimal version of live chat application.

This application comes with:

* Online user registration.
* App users list and their statuses.
* Instant message delivery.
* New message notification.
* Chat history

Its current `requirements.txt` file is:

```
Django==1.8
Pillow==3.0.0
```

## Installation

### 1. Virtual environment

`$ mkvirtualenv env_hellochat`
`$ source env_hellochat/bin/activate`

point project directory using command 'cd'

### 3. Requirements
Right there, you will find the *requirements.txt* file that has all the great debugging tools, django helpers and some other cool stuff. To install them, simply type:

`$ pip install -r requirements.txt`

#### Initialize the database
First set the database engine (PostgreSQL, MySQL, etc..) in your settings files;
by default it will be Sqlite,

`python manage.py migrate`

### Ready? Go!

`./manage.py runserver`
