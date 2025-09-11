"""Basic tests for living-twin-simulation package."""

import pytest
from living_twin_simulation import SimulationEngine
from living_twin_simulation.domain.models import CommunicationType


def test_import_simulation_engine():
    """Test that SimulationEngine can be imported."""
    assert SimulationEngine is not None


def test_import_communication_type():
    """Test that CommunicationType enum can be imported."""
    assert CommunicationType is not None
    assert hasattr(CommunicationType, 'NUDGE')
    assert hasattr(CommunicationType, 'RECOMMENDATION')
    assert hasattr(CommunicationType, 'ORDER')


def test_communication_type_values():
    """Test CommunicationType enum values."""
    assert CommunicationType.NUDGE.value == "nudge"
    assert CommunicationType.RECOMMENDATION.value == "recommendation"
    assert CommunicationType.ORDER.value == "order"


@pytest.mark.asyncio
async def test_simulation_engine_creation():
    """Test that SimulationEngine can be created."""
    engine = SimulationEngine("test_org")
    assert engine is not None
    assert engine.organization_id == "test_org"


def test_basic_math():
    """A simple test to verify pytest is working."""
    assert 2 + 2 == 4
