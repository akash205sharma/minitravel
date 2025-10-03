from django.db import models
from django.contrib.auth.models import User


class Trip(models.Model):
	name = models.CharField(max_length=200)
	destination_city = models.CharField(max_length=200)
	start_date = models.DateField()
	end_date = models.DateField()
	owner = models.ForeignKey(User, related_name="trips", on_delete=models.CASCADE, null=True, blank=True)
	# Bonus: Shareable link
	share_token = models.CharField(max_length=32, unique=True, blank=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	def save(self, *args, **kwargs):
		if not self.share_token:
			import secrets
			self.share_token = secrets.token_urlsafe(24)
		super().save(*args, **kwargs)

	def __str__(self) -> str:
		return f"{self.name} - {self.destination_city}"


class Activity(models.Model):
	trip = models.ForeignKey(Trip, related_name="activities", on_delete=models.CASCADE)
	title = models.CharField(max_length=200)
	# Optional time in HH:MM
	time = models.TimeField(null=True, blank=True)
	# Day offset starting at 1 (e.g., Day 1, Day 2)
	day_number = models.PositiveIntegerField()
	order_index = models.PositiveIntegerField(default=0)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		ordering = ["day_number", "order_index", "id"]

	def __str__(self) -> str:
		return f"Day {self.day_number}: {self.title}"
