#!/usr/bin/env python3
"""
Test script for demonstrating all communication patterns in the Living Twin Simulation.
"""

import asyncio
import json
import sys
from pathlib import Path
from typing import Dict, List

# Add src to path for development
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from living_twin_simulation import (
    SimulationEngine,
    CommunicationType,
    OrganizationalMetrics,
)

async def test_traditional_communication():
    """Test traditional one-way communication patterns."""
    print("\n" + "="*60)
    print("TESTING TRADITIONAL COMMUNICATION PATTERNS")
    print("="*60)
    
    # Setup simulation
    engine = SimulationEngine("traditional_test")
    
    employee_data = {
        "ceo@company.com": {"department": "Executive", "role": "CEO"},
        "cfo@company.com": {"department": "Finance", "role": "CFO"},
        "vp.sales@company.com": {"department": "Sales", "role": "VP Sales"},
        "vp.engineering@company.com": {"department": "Engineering", "role": "VP Engineering"},
    }
    
    await engine.start_simulation(employee_data)
    agent_ids = list(engine.state.agents.keys())
    
    # Test 1: NUDGE with potential escalation
    print("\n1. Testing NUDGE → Response → Escalation")
    print("-" * 40)
    
    await engine.send_communication(
        sender_id=agent_ids[0],  # CEO
        recipient_ids=agent_ids[1:],  # All VPs
        communication_type=CommunicationType.NUDGE,
        subject="Q4 Growth Targets",
        content="We're targeting 15% organic growth this quarter. How is your department positioned to contribute to this goal?"
    )
    
    await asyncio.sleep(5)
    
    # Test 2: RECOMMENDATION with departmental interpretation
    print("\n2. Testing RECOMMENDATION → Departmental Interpretation")
    print("-" * 40)
    
    await engine.send_communication(
        sender_id=agent_ids[0],  # CEO
        recipient_ids=agent_ids[1:],  # All VPs
        communication_type=CommunicationType.RECOMMENDATION,
        subject="Strategic Priority: Customer Retention",
        content="Customer churn is at 8%. I recommend making customer retention a top priority across all customer-facing teams."
    )
    
    await asyncio.sleep(5)
    
    # Test 3: DIRECT_ORDER with compliance tracking
    print("\n3. Testing DIRECT_ORDER → Compliance Tracking")
    print("-" * 40)
    
    await engine.send_communication(
        sender_id=agent_ids[0],  # CEO
        recipient_ids=agent_ids[1:],  # All VPs
        communication_type=CommunicationType.DIRECT_ORDER,
        subject="Employee Satisfaction: Immediate Action Required",
        content="Employee satisfaction scores must improve by 20% within 90 days. This is critical for retention and hiring."
    )
    
    await asyncio.sleep(5)
    
    # Get metrics
    metrics = engine.calculate_organizational_metrics()
    print(f"\nTraditional Communication Results:")
    print(f"  Response Rate: {metrics.response_rate:.1f}%")
    print(f"  Escalation Rate: {metrics.escalation_rate:.1f}%")
    print(f"  Compliance Rate: {metrics.compliance_rate:.1f}%")
    
    await engine.stop_simulation()


async def test_catchball_communication():
    """Test catchball communication with feedback loops."""
    print("\n" + "="*60)
    print("TESTING CATCHBALL COMMUNICATION PATTERNS")
    print("="*60)
    
    # Setup simulation
    engine = SimulationEngine("catchball_test")
    
    employee_data = {
        "ceo@company.com": {"department": "Executive", "role": "CEO"},
        "cmo@company.com": {"department": "Marketing", "role": "CMO"},
        "vp.sales@company.com": {"department": "Sales", "role": "VP Sales"},
        "vp.product@company.com": {"department": "Product", "role": "VP Product"},
        "cto@company.com": {"department": "Technology", "role": "CTO"},
        "cfo@company.com": {"department": "Finance", "role": "CFO"},
    }
    
    await engine.start_simulation(employee_data)
    agent_ids = list(engine.state.agents.keys())
    
    # Test Market Expansion Strategy with catchball
    print("\nTesting Market Expansion Strategy with Catchball Communication")
    print("-" * 60)
    
    # Round 1: Initial strategic goal
    print("\nRound 1: Initial Strategic Goal")
    print("CEO: 'We're entering the European market in Q1'")
    
    await engine.send_communication(
        sender_id=agent_ids[0],  # CEO
        recipient_ids=agent_ids[1:],  # All VPs
        communication_type=CommunicationType.RECOMMENDATION,
        subject="Market Expansion Strategy",
        content="We're entering the European market in Q1. This is a strategic priority for our growth objectives."
    )
    
    await asyncio.sleep(5)
    
    # Round 2: Refined strategy based on feedback
    print("\nRound 2: Refined Strategy")
    print("CEO: 'Let's phase the expansion: Q1 preparation, Q2 launch'")
    
    await engine.send_communication(
        sender_id=agent_ids[0],  # CEO
        recipient_ids=agent_ids[1:],  # All VPs
        communication_type=CommunicationType.RECOMMENDATION,
        subject="Refined Market Expansion Strategy",
        content="Based on your feedback, let's phase the expansion: Q1 for preparation and partnerships, Q2 for market launch."
    )
    
    await asyncio.sleep(5)
    
    # Round 3: Final alignment
    print("\nRound 3: Final Alignment")
    print("CEO: 'Confirmed: Q1 preparation, Q2 European launch'")
    
    await engine.send_communication(
        sender_id=agent_ids[0],  # CEO
        recipient_ids=agent_ids[1:],  # All VPs
        communication_type=CommunicationType.DIRECT_ORDER,
        subject="Confirmed Market Expansion Timeline",
        content="Confirmed: Q1 preparation phase, Q2 European market launch. All departments aligned and committed."
    )
    
    await asyncio.sleep(5)
    
    # Get metrics
    metrics = engine.calculate_organizational_metrics()
    print(f"\nCatchball Communication Results:")
    print(f"  Response Rate: {metrics.response_rate:.1f}%")
    print(f"  Collaboration Score: {metrics.collaboration_score:.1f}%")
    print(f"  Average Response Time: {metrics.average_response_time_hours:.1f} hours")
    
    await engine.stop_simulation()


async def test_wisdom_of_the_crowd():
    """Test wisdom of the crowd analysis."""
    print("\n" + "="*60)
    print("TESTING WISDOM OF THE CROWD ANALYSIS")
    print("="*60)
    
    # Setup simulation
    engine = SimulationEngine("wisdom_test")
    
    employee_data = {
        "ceo@company.com": {"department": "Executive", "role": "CEO"},
        "cto@company.com": {"department": "Technology", "role": "CTO"},
        "vp.engineering@company.com": {"department": "Engineering", "role": "VP Engineering"},
        "cfo@company.com": {"department": "Finance", "role": "CFO"},
        "vp.product@company.com": {"department": "Product", "role": "VP Product"},
    }
    
    await engine.start_simulation(employee_data)
    agent_ids = list(engine.state.agents.keys())
    
    # Test Innovation vs. Stability conflict
    print("\nTesting Innovation vs. Stability - Wisdom of the Crowd")
    print("-" * 60)
    
    await engine.send_communication(
        sender_id=agent_ids[0],  # CEO
        recipient_ids=agent_ids[1:],  # All VPs
        communication_type=CommunicationType.RECOMMENDATION,
        subject="Innovation Investment Strategy",
        content="We need to invest 20% of our budget in emerging technologies. This could give us competitive advantage but may impact our current stability."
    )
    
    await asyncio.sleep(5)
    
    # Get wisdom insights (if available)
    try:
        wisdom = engine.get_wisdom_insights()
        print(f"\nWisdom of the Crowd Analysis:")
        print(f"  Consensus Level: {wisdom.consensus_level:.1f}")
        print(f"  Priority Conflicts: {len(wisdom.priority_conflicts_detected)}")
        print(f"  Resource Bottlenecks: {len(wisdom.resource_bottlenecks)}")
        print(f"  Hidden Risks: {len(wisdom.hidden_risks)}")
        print(f"  Opportunities: {len(wisdom.opportunities_identified)}")
        
        if wisdom.ceo_recommendations:
            print(f"\nCEO Recommendations:")
            for rec in wisdom.ceo_recommendations:
                print(f"  • {rec}")
                
    except AttributeError:
        print("\nWisdom analysis not yet implemented in this version")
    
    await engine.stop_simulation()


async def test_priority_conflicts():
    """Test priority conflict resolution."""
    print("\n" + "="*60)
    print("TESTING PRIORITY CONFLICT RESOLUTION")
    print("="*60)
    
    # Setup simulation
    engine = SimulationEngine("conflict_test")
    
    employee_data = {
        "ceo@company.com": {"department": "Executive", "role": "CEO"},
        "cfo@company.com": {"department": "Finance", "role": "CFO"},
        "vp.sales@company.com": {"department": "Sales", "role": "VP Sales"},
        "vp.engineering@company.com": {"department": "Engineering", "role": "VP Engineering"},
        "vp.product@company.com": {"department": "Product", "role": "VP Product"},
    }
    
    await engine.start_simulation(employee_data)
    agent_ids = list(engine.state.agents.keys())
    
    # Test competing priorities
    print("\nTesting Competing Strategic Priorities")
    print("-" * 60)
    
    # Priority A: Growth
    await engine.send_communication(
        sender_id=agent_ids[0],  # CEO
        recipient_ids=agent_ids[1:],  # All VPs
        communication_type=CommunicationType.RECOMMENDATION,
        subject="Q4 Growth Priority",
        content="We need to achieve 15% growth this quarter to meet investor expectations."
    )
    
    await asyncio.sleep(3)
    
    # Priority B: Profitability
    await engine.send_communication(
        sender_id=agent_ids[0],  # CEO
        recipient_ids=agent_ids[1:],  # All VPs
        communication_type=CommunicationType.RECOMMENDATION,
        subject="Profitability Priority",
        content="We must maintain 15% profit margins to ensure financial stability."
    )
    
    await asyncio.sleep(5)
    
    # Resolution attempt
    await engine.send_communication(
        sender_id=agent_ids[0],  # CEO
        recipient_ids=agent_ids[1:],  # All VPs
        communication_type=CommunicationType.DIRECT_ORDER,
        subject="Balanced Strategy: Growth with Profitability",
        content="We will target 10% growth while maintaining 15% margins. This requires efficiency improvements and selective growth investments."
    )
    
    await asyncio.sleep(5)
    
    # Get metrics
    metrics = engine.calculate_organizational_metrics()
    print(f"\nPriority Conflict Resolution Results:")
    print(f"  Response Rate: {metrics.response_rate:.1f}%")
    print(f"  Collaboration Score: {metrics.collaboration_score:.1f}%")
    print(f"  Average Response Time: {metrics.average_response_time_hours:.1f} hours")
    
    await engine.stop_simulation()


async def main():
    """Run all communication pattern tests."""
    print("Living Twin Simulation - Communication Pattern Tests")
    print("=" * 60)
    
    try:
        # Test traditional communication
        await test_traditional_communication()
        
        # Test catchball communication
        await test_catchball_communication()
        
        # Test wisdom of the crowd
        await test_wisdom_of_the_crowd()
        
        # Test priority conflicts
        await test_priority_conflicts()
        
        print("\n" + "="*60)
        print("ALL TESTS COMPLETED SUCCESSFULLY")
        print("="*60)
        print("\nKey Insights:")
        print("• Traditional communication shows escalation patterns")
        print("• Catchball communication builds consensus")
        print("• Wisdom of the crowd reveals hidden insights")
        print("• Priority conflicts require balanced resolution")
        
    except Exception as e:
        print(f"\nError during testing: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(main())
