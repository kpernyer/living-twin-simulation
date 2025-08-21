#!/usr/bin/env python3
"""
Command-line interface for Living Twin Simulation Engine.
"""
import asyncio
import json
import sys
from pathlib import Path
from typing import Dict, Any

import click
from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich.progress import Progress, SpinnerColumn, TextColumn

# Add src to path for development
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from living_twin_simulation import (
    SimulationEngine,
    CommunicationType,
    OrganizationalMetrics,
)

console = Console()


def load_employee_data(file_path: str) -> Dict[str, Any]:
    """Load employee data from JSON file."""
    try:
        with open(file_path, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        console.print(f"[red]Error: Employee data file not found: {file_path}[/red]")
        sys.exit(1)
    except json.JSONDecodeError as e:
        console.print(f"[red]Error: Invalid JSON in employee data file: {e}[/red]")
        sys.exit(1)


def display_metrics(metrics: OrganizationalMetrics) -> None:
    """Display simulation metrics in a formatted table."""
    
    table = Table(title="Organizational Simulation Metrics")
    table.add_column("Metric", style="cyan", no_wrap=True)
    table.add_column("Value", style="magenta")
    table.add_column("Description", style="green")
    
    table.add_row("Organization ID", metrics.organization_id, "Target organization")
    table.add_row("Total Communications", str(metrics.total_communications), "Messages sent during simulation")
    table.add_row("Response Rate", f"{metrics.response_rate:.1f}%", "Percentage of communications that received responses")
    table.add_row("Escalation Rate", f"{metrics.escalation_rate:.1f}%", "Percentage of nudges that escalated to orders")
    table.add_row("Compliance Rate", f"{metrics.compliance_rate:.1f}%", "Percentage of direct orders followed")
    table.add_row("Collaboration Score", f"{metrics.collaboration_score:.1f}%", "Cross-department interaction level")
    table.add_row("Average Stress Level", f"{metrics.stress_level_average:.2f}", "Average stress across all agents (0.0-1.0)")
    table.add_row("Simulation Duration", 
                  f"{(metrics.time_period_end - metrics.time_period_start).total_seconds():.0f}s", 
                  "Real-time duration of simulation")
    
    console.print(table)
    
    # Display friction points if any
    if metrics.high_friction_communications:
        console.print("\n[yellow]High Friction Communications:[/yellow]")
        for comm_id in metrics.high_friction_communications[:5]:
            console.print(f"  • {comm_id}")
    
    if metrics.bottleneck_agents:
        console.print("\n[yellow]Bottleneck Agents:[/yellow]")
        for agent_id in metrics.bottleneck_agents[:5]:
            console.print(f"  • {agent_id}")


@click.group()
@click.version_option(version="0.1.0")
def cli():
    """Living Twin Simulation Engine CLI"""
    pass


@cli.command()
@click.option('--org-id', required=True, help='Organization ID for the simulation')
@click.option('--employees', required=True, type=click.Path(exists=True), 
              help='JSON file containing employee data')
@click.option('--duration', default=30, help='Simulation duration in simulated days')
@click.option('--acceleration', default=144, help='Time acceleration factor (144 = 10s = 1 day)')
@click.option('--output', help='Output file for simulation results (JSON)')
@click.option('--verbose', '-v', is_flag=True, help='Verbose logging')
def run(org_id: str, employees: str, duration: int, acceleration: int, output: str, verbose: bool):
    """Run a complete organizational behavior simulation."""
    
    if verbose:
        import logging
        logging.basicConfig(level=logging.INFO)
    
    console.print(Panel(f"[bold blue]Living Twin Simulation Engine[/bold blue]\n"
                       f"Organization: {org_id}\n"
                       f"Duration: {duration} simulated days\n"
                       f"Acceleration: {acceleration}x speed"))
    
    # Load employee data
    employee_data = load_employee_data(employees)
    console.print(f"[green]Loaded {len(employee_data)} employees[/green]")
    
    async def run_simulation():
        # Create and configure simulation
        engine = SimulationEngine(org_id, acceleration)
        
        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            console=console,
        ) as progress:
            
            # Start simulation
            task = progress.add_task("Starting simulation...", total=None)
            await engine.start_simulation(employee_data)
            progress.update(task, description="Simulation started")
            
            # Run for specified duration
            progress.update(task, description=f"Running simulation for {duration} days...")
            
            # Simulate some communications
            agent_ids = list(engine.state.agents.keys())
            if len(agent_ids) >= 2:
                # Send some test communications
                for i in range(min(5, len(agent_ids) // 2)):
                    sender = agent_ids[i]
                    recipients = agent_ids[i+1:i+3]  # Send to 1-2 recipients
                    
                    await engine.send_communication(
                        sender_id=sender,
                        recipient_ids=recipients,
                        communication_type=CommunicationType.NUDGE,
                        subject=f"Test Communication {i+1}",
                        content=f"This is a test organizational communication for simulation purposes.",
                        priority_level=3
                    )
            
            # Wait for simulation to process
            await asyncio.sleep(5)  # Let simulation run for a bit
            
            # Stop simulation
            progress.update(task, description="Stopping simulation...")
            await engine.stop_simulation()
            
            # Calculate final metrics
            progress.update(task, description="Calculating metrics...")
            metrics = engine.calculate_organizational_metrics()
            
            progress.update(task, description="Complete!", completed=True)
        
        return metrics
    
    # Run the simulation
    try:
        metrics = asyncio.run(run_simulation())
        
        # Display results
        console.print("\n")
        display_metrics(metrics)
        
        # Save results if output file specified
        if output:
            result_data = {
                "organization_id": metrics.organization_id,
                "simulation_id": metrics.simulation_id,
                "metrics": {
                    "total_communications": metrics.total_communications,
                    "response_rate": metrics.response_rate,
                    "escalation_rate": metrics.escalation_rate,
                    "compliance_rate": metrics.compliance_rate,
                    "collaboration_score": metrics.collaboration_score,
                    "stress_level_average": metrics.stress_level_average,
                    "department_metrics": metrics.department_metrics,
                },
                "duration": {
                    "start_time": metrics.time_period_start.isoformat(),
                    "end_time": metrics.time_period_end.isoformat(),
                    "duration_seconds": (metrics.time_period_end - metrics.time_period_start).total_seconds(),
                }
            }
            
            with open(output, 'w') as f:
                json.dump(result_data, f, indent=2)
            
            console.print(f"[green]Results saved to {output}[/green]")
        
    except KeyboardInterrupt:
        console.print("\n[yellow]Simulation interrupted by user[/yellow]")
        sys.exit(1)
    except Exception as e:
        console.print(f"[red]Simulation failed: {e}[/red]")
        sys.exit(1)


@cli.command()
@click.argument('employee_file', type=click.Path(exists=True))
def validate(employee_file: str):
    """Validate employee data format."""
    
    console.print(f"[blue]Validating employee data: {employee_file}[/blue]")
    
    try:
        employee_data = load_employee_data(employee_file)
        
        # Validate structure
        required_fields = ['department', 'role']
        valid_count = 0
        warnings = []
        
        for email, data in employee_data.items():
            if not isinstance(data, dict):
                warnings.append(f"Invalid data for {email}: expected object, got {type(data).__name__}")
                continue
            
            missing_fields = [field for field in required_fields if field not in data]
            if missing_fields:
                warnings.append(f"Missing fields for {email}: {missing_fields}")
                continue
            
            valid_count += 1
        
        # Display results
        table = Table(title="Employee Data Validation")
        table.add_column("Metric", style="cyan")
        table.add_column("Value", style="magenta")
        
        table.add_row("Total Employees", str(len(employee_data)))
        table.add_row("Valid Employees", str(valid_count))
        table.add_row("Warnings", str(len(warnings)))
        
        console.print(table)
        
        if warnings:
            console.print("\n[yellow]Warnings:[/yellow]")
            for warning in warnings[:10]:  # Show first 10 warnings
                console.print(f"  • {warning}")
            
            if len(warnings) > 10:
                console.print(f"  ... and {len(warnings) - 10} more warnings")
        
        if valid_count == len(employee_data):
            console.print("\n[green]✅ Employee data is valid![/green]")
        else:
            console.print(f"\n[yellow]⚠️  {len(employee_data) - valid_count} employees have issues[/yellow]")
    
    except Exception as e:
        console.print(f"[red]Validation failed: {e}[/red]")
        sys.exit(1)


@cli.command()
def example():
    """Generate example employee data file."""
    
    example_data = {
        "ceo@company.com": {
            "department": "Executive",
            "role": "CEO"
        },
        "vp.engineering@company.com": {
            "department": "Engineering", 
            "role": "VP Engineering"
        },
        "engineering.manager@company.com": {
            "department": "Engineering",
            "role": "Engineering Manager"
        },
        "john.doe@company.com": {
            "department": "Engineering",
            "role": "Senior Engineer"
        },
        "jane.smith@company.com": {
            "department": "Engineering", 
            "role": "Engineer"
        },
        "sales.manager@company.com": {
            "department": "Sales",
            "role": "Sales Manager"
        },
        "sales.rep@company.com": {
            "department": "Sales",
            "role": "Sales Representative"
        }
    }
    
    output_file = "example_employees.json"
    with open(output_file, 'w') as f:
        json.dump(example_data, f, indent=2)
    
    console.print(f"[green]Example employee data created: {output_file}[/green]")
    console.print("\n[blue]Usage:[/blue]")
    console.print(f"simulation run --org-id acme_corp --employees {output_file}")


def main():
    """Main CLI entry point."""
    cli()


if __name__ == "__main__":
    main()
