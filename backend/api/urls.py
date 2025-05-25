from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

urlpatterns = [
    path('leave-apply', apply_leave, name='leave-apply'),
    path('approve-leave', manage_leave, name='approve-leave'),
    path('update-leave-status', update_leave_status, name='update-leave-status'),
    path('login', LoginView.as_view(), name='login'),
]
