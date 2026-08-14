from typing import List, Dict, Any

class RecommendationEngine:
    """
    Multi-factor Recommendation Engine implementing formula:
    Score = 0.25 * Preference + 0.20 * Budget + 0.15 * Distance + 0.15 * Rating + 0.10 * Weather + 0.10 * Popularity + 0.05 * Availability
    """
    
    @staticmethod
    def calculate_destination_score(
        destination: Dict[str, Any], 
        user_interests: List[str], 
        user_budget: float,
        weather_condition: str = "Sunny"
    ) -> float:
        # 1. User Preference Compatibility (25%)
        pref_score = 1.0 if destination.get("category", "").lower() in [i.lower() for i in user_interests] else 0.5
        
        # 2. Budget Compatibility (20%)
        avg_cost = float(destination.get("average_daily_cost", 3000))
        budget_ratio = (user_budget / 3) / max(avg_cost, 1)
        budget_score = min(1.0, max(0.2, budget_ratio))
        
        # 3. Distance / Accessibility Score (15%)
        distance_score = 0.85
        
        # 4. Rating Score (15%)
        rating = float(destination.get("rating", 4.5))
        rating_score = rating / 5.0
        
        # 5. Weather Suitability (10%)
        weather_score = 0.95 if "rain" not in weather_condition.lower() else 0.40
        
        # 6. Popularity (10%)
        popularity_score = 0.90
        
        # 7. Availability (5%)
        availability_score = 1.0
        
        final_score = (
            (0.25 * pref_score) +
            (0.20 * budget_score) +
            (0.15 * distance_score) +
            (0.15 * rating_score) +
            (0.10 * weather_score) +
            (0.10 * popularity_score) +
            (0.05 * availability_score)
        )
        return round(final_score * 100, 2)
