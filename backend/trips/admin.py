from django.contrib import admin
from .models import Trip, Activity


class ActivityInline(admin.TabularInline):
	model = Activity
	extra = 0


@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
	list_display = ("id", "name", "destination_city", "start_date", "end_date")
	search_fields = ("name", "destination_city")
	inlines = [ActivityInline]


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
	list_display = ("id", "trip", "day_number", "order_index", "title", "time")
	list_filter = ("day_number",)
