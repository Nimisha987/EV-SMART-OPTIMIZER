import math

def calculate_distance(lat1, lng1, lat2, lng2):
    return math.sqrt((lat2 - lat1)**2 + (lng2 - lng1)**2)