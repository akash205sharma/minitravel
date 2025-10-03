from rest_framework.routers import DefaultRouter
from .views import TripViewSet
from django.urls import path
from .views import register


router = DefaultRouter()
router.register(r'trips', TripViewSet, basename='trip')

urlpatterns = router.urls

urlpatterns += [
    path('auth/register/', register, name='register')
]
