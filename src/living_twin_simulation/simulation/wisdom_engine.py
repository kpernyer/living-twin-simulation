"""
Wisdom of the Crowd engine for analyzing collective responses and detecting patterns.
"""

import logging
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
from collections import defaultdict

from ..domain.models import (
    CatchballCommunication,
    CatchballFeedback,
    WisdomOfTheCrowd,
    PriorityConflict,
    SimulationAgent,
    PriorityCommunication,
    ResponseType,
    CommunicationType,
)

logger = logging.getLogger(__name__)


class WisdomEngine:
    """Engine for analyzing collective wisdom and catchball communication patterns."""
    
    def __init__(self):
        self.hesitation_patterns = {
            "delayed": ["I'll need to think about this", "Let me get back to you", "I need to consult"],
            "uncertain": ["I'm not sure", "This is challenging", "We might have some issues"],
            "conflicted": ["This conflicts with", "We have competing priorities", "This will impact"],
            "overwhelmed": ["We're already at capacity", "This is a lot to take on", "We're stretched thin"],
            "resistant": ["This doesn't align with", "We have different priorities", "This isn't feasible"]
        }
        
        self.priority_indicators = {
            "resource": ["budget", "headcount", "capacity", "resources", "funding"],
            "timeline": ["deadline", "timeline", "schedule", "quarter", "timing"],
            "approach": ["strategy", "method", "approach", "process", "methodology"],
            "values": ["culture", "values", "principles", "ethics", "standards"]
        }
    
    def analyze_catchball_feedback(
        self,
        catchball: CatchballCommunication,
        agents: Dict[str, SimulationAgent]
    ) -> WisdomOfTheCrowd:
        """Analyze feedback from catchball communication to extract collective wisdom."""
        
        wisdom = WisdomOfTheCrowd(
            catchball_id=catchball.id,
            communication_id=catchball.original_communication_id
        )
        
        if not catchball.feedback_received:
            return wisdom
        
        # Analyze response patterns
        self._analyze_response_patterns(catchball, wisdom)
        
        # Detect priority conflicts
        self._detect_priority_conflicts(catchball, wisdom)
        
        # Analyze department-specific insights
        self._analyze_department_insights(catchball, wisdom, agents)
        
        # Generate CEO recommendations
        self._generate_ceo_recommendations(catchball, wisdom)
        
        # Calculate consensus level
        wisdom.consensus_level = self._calculate_consensus_level(catchball)
        
        logger.info(f"Wisdom analysis complete for catchball {catchball.id}")
        return wisdom
    
    def _analyze_response_patterns(
        self,
        catchball: CatchballCommunication,
        wisdom: WisdomOfTheCrowd
    ) -> None:
        """Analyze response timing and hesitation patterns."""
        
        delays = []
        hesitation_counts = defaultdict(int)
        confidence_levels = []
        
        for feedback in catchball.feedback_received:
            # Response delay analysis
            delays.append(feedback.response_delay_hours)
            
            # Hesitation pattern analysis
            for pattern, indicators in self.hesitation_patterns.items():
                for indicator in indicators:
                    if indicator.lower() in feedback.feedback_content.lower():
                        hesitation_counts[pattern] += 1
                        feedback.hesitation_indicators.append(pattern)
                        break
            
            # Confidence analysis
            confidence_levels.append(feedback.confidence_level)
        
        # Calculate averages and distributions
        wisdom.average_response_delay = sum(delays) / len(delays) if delays else 0.0
        wisdom.hesitation_patterns = dict(hesitation_counts)
        
        # Confidence distribution
        confidence_dist = defaultdict(int)
        for level in confidence_levels:
            if level < 0.3:
                confidence_dist["low"] += 1
            elif level < 0.7:
                confidence_dist["medium"] += 1
            else:
                confidence_dist["high"] += 1
        wisdom.confidence_distribution = dict(confidence_dist)
    
    def _detect_priority_conflicts(
        self,
        catchball: CatchballCommunication,
        wisdom: WisdomOfTheCrowd
    ) -> None:
        """Detect priority conflicts from feedback content."""
        
        conflicts = []
        bottlenecks = []
        risks = []
        opportunities = []
        
        for feedback in catchball.feedback_received:
            content_lower = feedback.feedback_content.lower()
            
            # Detect resource bottlenecks
            if any(word in content_lower for word in ["budget", "headcount", "capacity", "resources"]):
                bottlenecks.append(f"Resource constraint in {feedback.department}")
            
            # Detect timeline conflicts
            if any(word in content_lower for word in ["deadline", "timeline", "schedule", "quarter"]):
                conflicts.append(f"Timeline conflict in {feedback.department}")
            
            # Detect approach conflicts
            if any(word in content_lower for word in ["strategy", "approach", "method", "process"]):
                conflicts.append(f"Approach conflict in {feedback.department}")
            
            # Detect hidden risks
            if any(word in content_lower for word in ["risk", "concern", "issue", "problem", "challenge"]):
                risks.append(f"Risk identified by {feedback.department}: {feedback.feedback_content[:100]}")
            
            # Detect opportunities
            if any(word in content_lower for word in ["opportunity", "potential", "benefit", "advantage"]):
                opportunities.append(f"Opportunity identified by {feedback.department}: {feedback.feedback_content[:100]}")
        
        wisdom.priority_conflicts_detected = list(set(conflicts))
        wisdom.resource_bottlenecks = list(set(bottlenecks))
        wisdom.hidden_risks = risks
        wisdom.opportunities_identified = opportunities
    
    def _analyze_department_insights(
        self,
        catchball: CatchballCommunication,
        wisdom: WisdomOfTheCrowd,
        agents: Dict[str, SimulationAgent]
    ) -> None:
        """Analyze insights by department."""
        
        department_feedback = defaultdict(list)
        
        for feedback in catchball.feedback_received:
            department_feedback[feedback.department].append(feedback)
        
        for department, feedbacks in department_feedback.items():
            insights = {
                "response_rate": len(feedbacks) / len([f for f in catchball.feedback_received if f.department == department]),
                "average_confidence": sum(f.confidence_level for f in feedbacks) / len(feedbacks),
                "average_sentiment": sum(f.sentiment for f in feedbacks) / len(feedbacks),
                "main_concerns": self._extract_main_concerns(feedbacks),
                "commitment_level": sum(f.commitment_level for f in feedbacks) / len(feedbacks)
            }
            wisdom.department_insights[department] = insights
        
        # Detect cross-department conflicts
        wisdom.cross_department_conflicts = self._detect_cross_department_conflicts(department_feedback)
    
    def _extract_main_concerns(self, feedbacks: List[CatchballFeedback]) -> List[str]:
        """Extract main concerns from feedback."""
        concerns = []
        for feedback in feedbacks:
            if feedback.sentiment < 0.3:
                concerns.append(feedback.feedback_content[:100])
        return concerns[:3]  # Top 3 concerns
    
    def _detect_cross_department_conflicts(
        self,
        department_feedback: Dict[str, List[CatchballFeedback]]
    ) -> List[Dict]:
        """Detect conflicts between departments."""
        conflicts = []
        
        departments = list(department_feedback.keys())
        for i, dept1 in enumerate(departments):
            for dept2 in departments[i+1:]:
                # Check for conflicting priorities
                dept1_priorities = self._extract_priorities(department_feedback[dept1])
                dept2_priorities = self._extract_priorities(department_feedback[dept2])
                
                conflicting_priorities = set(dept1_priorities) & set(dept2_priorities)
                if conflicting_priorities:
                    conflicts.append({
                        "departments": [dept1, dept2],
                        "conflicting_priorities": list(conflicting_priorities),
                        "severity": "medium"
                    })
        
        return conflicts
    
    def _extract_priorities(self, feedbacks: List[CatchballFeedback]) -> List[str]:
        """Extract priorities mentioned in feedback."""
        priorities = []
        for feedback in feedbacks:
            if "priority" in feedback.feedback_content.lower():
                priorities.extend(feedback.priority_conflicts_mentioned)
        return priorities
    
    def _generate_ceo_recommendations(
        self,
        catchball: CatchballCommunication,
        wisdom: WisdomOfTheCrowd
    ) -> None:
        """Generate recommendations for the CEO based on collective wisdom."""
        
        recommendations = []
        escalation_triggers = []
        consensus_suggestions = []
        
        # Low consensus triggers escalation
        if wisdom.consensus_level < 0.4:
            escalation_triggers.append("Low consensus detected - consider executive intervention")
            consensus_suggestions.append("Schedule executive alignment meeting")
        
        # High hesitation suggests concerns
        if wisdom.hesitation_patterns.get("conflicted", 0) > len(catchball.feedback_received) * 0.3:
            escalation_triggers.append("High conflict level detected")
            consensus_suggestions.append("Address competing priorities before proceeding")
        
        # Resource bottlenecks need attention
        if wisdom.resource_bottlenecks:
            recommendations.append("Address resource constraints before implementation")
        
        # Hidden risks need mitigation
        if wisdom.hidden_risks:
            recommendations.append("Develop risk mitigation strategies")
        
        # Opportunities should be captured
        if wisdom.opportunities_identified:
            recommendations.append("Capture identified opportunities")
        
        wisdom.ceo_recommendations = recommendations
        wisdom.escalation_triggers = escalation_triggers
        wisdom.consensus_building_suggestions = consensus_suggestions
    
    def _calculate_consensus_level(self, catchball: CatchballCommunication) -> float:
        """Calculate the level of consensus among responses."""
        if not catchball.feedback_received:
            return 0.0
        
        # Calculate based on response types and sentiment
        positive_responses = sum(1 for f in catchball.feedback_received if f.sentiment > 0.3)
        action_responses = sum(1 for f in catchball.feedback_received if f.response_type == ResponseType.TAKE_ACTION)
        
        consensus_score = (positive_responses + action_responses) / (len(catchball.feedback_received) * 2)
        return min(1.0, consensus_score)
    
    def create_priority_conflict(
        self,
        conflict_type: str,
        priority_a: str,
        priority_b: str,
        affected_departments: List[str],
        description: str
    ) -> PriorityConflict:
        """Create a new priority conflict."""
        
        return PriorityConflict(
            conflict_type=conflict_type,
            priority_a=priority_a,
            priority_b=priority_b,
            affected_departments=affected_departments,
            description=description,
            severity=0.7  # Default to medium-high severity
        )
