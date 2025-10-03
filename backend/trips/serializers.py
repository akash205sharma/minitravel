from rest_framework import serializers
from .models import Trip, Activity


class ActivitySerializer(serializers.ModelSerializer):
	class Meta:
		model = Activity
		fields = [
			'id', 'title', 'time', 'day_number', 'order_index'
		]


class TripSerializer(serializers.ModelSerializer):
	activities = ActivitySerializer(many=True)
	owner = serializers.ReadOnlyField(source='owner.username')

	class Meta:
		model = Trip
		fields = [
			'id', 'name', 'destination_city', 'start_date', 'end_date', 'activities', 'share_token', 'owner'
		]

	def create(self, validated_data):
		activities_data = validated_data.pop('activities', [])
		trip = Trip.objects.create(**validated_data)
		for index, activity in enumerate(activities_data):
			Activity.objects.create(trip=trip, order_index=index, **activity)
		return trip

	def update(self, instance, validated_data):
		activities_data = validated_data.pop('activities', None)
		for attr, value in validated_data.items():
			setattr(instance, attr, value)
		instance.save()
		if activities_data is not None:
			instance.activities.all().delete()
			for index, activity in enumerate(activities_data):
				Activity.objects.create(trip=instance, order_index=index, **activity)
		return instance


