#!/usr/bin/env python3
"""
Living Twin Simulation - Automated PlantUML Generator

Usage: python tools/generate_uml.py

This script analyzes the simulation codebase and generates:
- Agent architecture diagrams
- Simulation flow diagrams  
- System component diagrams
- Agent interaction diagrams
- System description markdown

Supports Python (simulation backend) and Next.js (web frontend).
"""

import os
import re
import ast
import json
import subprocess
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Set, Optional, Any
from dataclasses import dataclass, field
from collections import defaultdict

@dataclass
class ComponentInfo:
    name: str
    type: str  # 'agent', 'simulation', 'engine', 'web', 'config', 'cli'
    path: str
    classes: List[str] = field(default_factory=list)
    functions: List[str] = field(default_factory=list)
    dependencies: List[str] = field(default_factory=list)
    exports: List[str] = field(default_factory=list)
    methods: List[str] = field(default_factory=list)

class UMLGenerator:
    def __init__(self, project_root: str):
        self.project_root = Path(project_root)
        self.docs_path = self.project_root / "docs" / "system"
        
        # Analysis results
        self.components: Dict[str, ComponentInfo] = {}
        self.agents: Dict[str, ComponentInfo] = {}
        self.simulation_engines: Dict[str, ComponentInfo] = {}
        self.web_components: Dict[str, ComponentInfo] = {}
        self.cli_components: Dict[str, ComponentInfo] = {}
        self.config_components: Dict[str, ComponentInfo] = {}
        
        # Dependencies and patterns
        self.python_deps: Set[str] = set()
        self.node_deps: Set[str] = set()
        self.simulation_patterns: List[str] = []
        self.agent_types: Set[str] = set()
        
    def generate_all(self):
        """Generate all UML diagrams and documentation"""
        print("🔍 Analyzing Living Twin Simulation...")
        self.analyze_codebase()
        
        print("🤖 Generating agent architecture...")
        self.generate_agent_architecture()
        
        print("⚡ Generating simulation flow...")
        self.generate_simulation_flow()
        
        print("🏗️ Generating system architecture...")
        self.generate_system_architecture()
        
        print("🔄 Generating agent interactions...")
        self.generate_agent_interactions()
        
        print("📝 Creating system description...")
        self.generate_system_description()
        
        print("🖼️ Rendering PlantUML diagrams...")
        self.render_diagrams()
        
        print("✅ UML generation complete!")
        print(f"📂 Check: {self.docs_path}")

    def analyze_codebase(self):
        """Analyze the simulation codebase structure"""
        # Analyze Python source code
        src_dir = self.project_root / "src"
        if src_dir.exists():
            self._analyze_python_source(src_dir)
        
        # Analyze web frontend
        web_dir = self.project_root / "web"
        if web_dir.exists():
            self._analyze_web_frontend(web_dir)
        
        # Analyze CLI
        cli_dir = self.project_root / "cli"
        if cli_dir.exists():
            self._analyze_cli(cli_dir)
        
        # Analyze configuration
        config_dir = self.project_root / "config"
        if config_dir.exists():
            self._analyze_config(config_dir)
        
        # Analyze dependencies
        self._analyze_dependencies()

    def _analyze_python_source(self, src_dir: Path):
        """Analyze Python source code"""
        for py_file in src_dir.rglob("*.py"):
            if "__pycache__" in str(py_file):
                continue
                
            relative_path = py_file.relative_to(self.project_root)
            component_type = self._determine_component_type(relative_path)
            
            component = ComponentInfo(
                name=py_file.stem,
                type=component_type,
                path=str(relative_path)
            )
            
            try:
                content = py_file.read_text(encoding="utf-8")
                self._extract_python_info(content, component)
                
                # Categorize components
                if component_type == "agent":
                    self.agents[component.name] = component
                elif component_type == "simulation":
                    self.simulation_engines[component.name] = component
                
                self.components[f"{relative_path}"] = component
                
            except Exception as e:
                print(f"⚠️ Could not parse {py_file}: {e}")

    def _determine_component_type(self, path: Path) -> str:
        """Determine component type based on file path"""
        path_str = str(path).lower()
        
        if "agents" in path_str:
            return "agent"
        elif "simulation" in path_str:
            return "simulation"
        elif "engine" in path_str:
            return "engine"
        elif "config" in path_str:
            return "config"
        elif "cli" in path_str:
            return "cli"
        else:
            return "core"

    def _extract_python_info(self, content: str, component: ComponentInfo):
        """Extract information from Python files"""
        try:
            tree = ast.parse(content)
            
            for node in ast.walk(tree):
                if isinstance(node, ast.ClassDef):
                    component.classes.append(node.name)
                    
                    # Detect agent types
                    if component.type == "agent":
                        self.agent_types.add(node.name)
                    
                    # Extract methods
                    for item in node.body:
                        if isinstance(item, ast.FunctionDef):
                            component.methods.append(f"{node.name}.{item.name}()")
                
                elif isinstance(node, ast.FunctionDef):
                    component.functions.append(node.name)
                
                # Extract imports
                elif isinstance(node, ast.Import):
                    for alias in node.names:
                        component.dependencies.append(alias.name)
                elif isinstance(node, ast.ImportFrom):
                    if node.module:
                        component.dependencies.append(node.module)
            
            # Detect simulation patterns
            if "async def" in content:
                self.simulation_patterns.append("Async Processing")
            if "threading" in content or "asyncio" in content:
                self.simulation_patterns.append("Concurrent Execution")
            if "websocket" in content.lower():
                self.simulation_patterns.append("Real-time Communication")
            if "schedule" in content.lower():
                self.simulation_patterns.append("Time-based Simulation")
                
        except Exception as e:
            print(f"⚠️ Could not parse Python content: {e}")

    def _analyze_web_frontend(self, web_dir: Path):
        """Analyze Next.js web frontend"""
        for ts_file in web_dir.rglob("*.tsx"):
            if "node_modules" in str(ts_file) or ".next" in str(ts_file):
                continue
                
            relative_path = ts_file.relative_to(self.project_root)
            
            component = ComponentInfo(
                name=ts_file.stem,
                type="web",
                path=str(relative_path)
            )
            
            try:
                content = ts_file.read_text(encoding="utf-8")
                self._extract_ts_info(content, component)
                self.web_components[component.name] = component
                self.components[str(relative_path)] = component
                
            except Exception as e:
                print(f"⚠️ Could not parse {ts_file}: {e}")

    def _extract_ts_info(self, content: str, component: ComponentInfo):
        """Extract information from TypeScript/React files"""
        # Extract React components
        react_comp_matches = re.findall(r'(?:const|function)\s+(\w+).*?(?:React\.FC|JSX\.Element|\(\)\s*=>)', content)
        component.classes.extend([f"{name} (Component)" for name in react_comp_matches])
        
        # Extract functions
        func_matches = re.findall(r'(?:const|function)\s+(\w+)', content)
        component.functions.extend(func_matches)
        
        # Extract imports
        import_matches = re.findall(r'import.*?from\s+[\'"]([^\'"]+)[\'"]', content)
        for imp in import_matches:
            if not imp.startswith('.'):
                component.dependencies.append(imp)
        
        # Extract exports
        export_matches = re.findall(r'export\s+(?:default\s+)?(?:const|function|class)\s+(\w+)', content)
        component.exports.extend(export_matches)

    def _analyze_cli(self, cli_dir: Path):
        """Analyze CLI components"""
        for py_file in cli_dir.rglob("*.py"):
            relative_path = py_file.relative_to(self.project_root)
            
            component = ComponentInfo(
                name=py_file.stem,
                type="cli",
                path=str(relative_path)
            )
            
            try:
                content = py_file.read_text(encoding="utf-8")
                self._extract_python_info(content, component)
                self.cli_components[component.name] = component
                self.components[str(relative_path)] = component
                
            except Exception as e:
                print(f"⚠️ Could not parse {py_file}: {e}")

    def _analyze_config(self, config_dir: Path):
        """Analyze configuration files"""
        for config_file in config_dir.rglob("*"):
            if config_file.is_file() and config_file.suffix in ['.py', '.json', '.yaml', '.yml', '.toml']:
                relative_path = config_file.relative_to(self.project_root)
                
                component = ComponentInfo(
                    name=config_file.stem,
                    type="config",
                    path=str(relative_path)
                )
                
                if config_file.suffix == '.py':
                    try:
                        content = config_file.read_text(encoding="utf-8")
                        self._extract_python_info(content, component)
                    except Exception:
                        pass
                
                self.config_components[component.name] = component
                self.components[str(relative_path)] = component

    def _analyze_dependencies(self):
        """Analyze project dependencies"""
        # Python dependencies
        pyproject_file = self.project_root / "pyproject.toml"
        if pyproject_file.exists():
            try:
                content = pyproject_file.read_text()
                
                # Common simulation/ML dependencies
                deps_mapping = {
                    "fastapi": "FastAPI",
                    "uvicorn": "Uvicorn",
                    "asyncio": "AsyncIO",
                    "websockets": "WebSockets",
                    "pydantic": "Pydantic",
                    "openai": "OpenAI",
                    "numpy": "NumPy",
                    "pandas": "Pandas",
                    "pytest": "PyTest",
                    "httpx": "HTTPX"
                }
                
                for dep, name in deps_mapping.items():
                    if dep in content.lower():
                        self.python_deps.add(name)
                        
            except Exception:
                pass
        
        # Node.js dependencies
        web_package_json = self.project_root / "web" / "package.json"
        if web_package_json.exists():
            try:
                with web_package_json.open() as f:
                    data = json.load(f)
                    deps = {**data.get("dependencies", {}), **data.get("devDependencies", {})}
                    
                    deps_mapping = {
                        "react": "React",
                        "next": "Next.js",
                        "typescript": "TypeScript",
                        "tailwindcss": "Tailwind CSS",
                        "@types/react": "React Types",
                        "socket.io": "Socket.IO"
                    }
                    
                    for dep, name in deps_mapping.items():
                        if dep in deps:
                            self.node_deps.add(name)
                            
            except Exception:
                pass

    def generate_agent_architecture(self):
        """Generate agent architecture diagram"""
        uml = []
        uml.append("@startuml Living Twin Simulation - Agent Architecture")
        uml.append("!theme plain")
        uml.append("title Agent System Architecture - Auto Generated")
        uml.append("")
        
        # Agent types
        if self.agent_types:
            uml.append("package \"Agent Types\" {")
            for agent_type in sorted(self.agent_types):
                uml.append(f"  class {agent_type} {{")
                
                # Find methods for this agent
                for component in self.agents.values():
                    if agent_type in component.classes:
                        methods = [m for m in component.methods if m.startswith(f"{agent_type}.")]
                        for method in methods[:5]:  # Limit to 5 methods
                            method_name = method.split('.', 1)[1]
                            uml.append(f"    +{method_name}")
                        if len(methods) > 5:
                            uml.append(f"    +... ({len(methods) - 5} more)")
                        break
                
                uml.append("  }")
            uml.append("}")
            uml.append("")
        
        # Simulation engines
        if self.simulation_engines:
            uml.append("package \"Simulation Engines\" {")
            for engine_name, engine_info in self.simulation_engines.items():
                if engine_info.classes:
                    for class_name in engine_info.classes:
                        uml.append(f"  class {class_name} {{")
                        
                        # Add key methods
                        methods = [m for m in engine_info.methods if m.startswith(f"{class_name}.")]
                        for method in methods[:3]:
                            method_name = method.split('.', 1)[1]
                            uml.append(f"    +{method_name}")
                        
                        uml.append("  }")
            uml.append("}")
            uml.append("")
        
        # Agent relationships
        if self.agent_types and self.simulation_engines:
            uml.append("' Agent-Engine relationships")
            for engine_info in self.simulation_engines.values():
                if engine_info.classes:
                    engine_class = engine_info.classes[0]
                    for agent_type in list(self.agent_types)[:3]:  # Limit connections
                        uml.append(f"{engine_class} --> {agent_type} : manages")
        
        uml.append("")
        uml.append("@enduml")
        
        self._write_uml_file("agent_architecture.puml", "\n".join(uml))

    def generate_simulation_flow(self):
        """Generate simulation flow sequence diagram"""
        uml = []
        uml.append("@startuml Living Twin Simulation - Simulation Flow")
        uml.append("title Simulation Execution Flow - Auto Generated")
        uml.append("")
        
        uml.append("actor User")
        
        # Add CLI if exists
        if self.cli_components:
            uml.append("participant \"CLI\" as CLI")
        
        # Add web interface if exists
        if self.web_components:
            web_name = list(self.web_components.keys())[0] if self.web_components else "Web"
            uml.append(f"participant \"Web Interface\" as Web")
        
        # Add simulation engines
        for engine_name, engine_info in list(self.simulation_engines.items())[:3]:
            if engine_info.classes:
                engine_class = engine_info.classes[0]
                uml.append(f"participant \"{engine_class}\" as {engine_class}")
        
        # Add agents
        for agent_type in list(self.agent_types)[:3]:
            uml.append(f"participant \"{agent_type}\" as {agent_type}")
        
        uml.append("")
        uml.append("== Simulation Initialization ==")
        
        if self.cli_components:
            uml.append("User -> CLI : Start simulation")
            
            if self.simulation_engines:
                engine_values = list(self.simulation_engines.values())
                engine_class = engine_values[0].classes[0] if engine_values and engine_values[0].classes else "SimulationEngine"
                uml.append(f"CLI -> {engine_class} : initialize()")
                
                if self.config_components:
                    uml.append(f"{engine_class} -> {engine_class} : load_config()")
                
                # Agent creation
                for agent_type in list(self.agent_types)[:2]:
                    uml.append(f"{engine_class} -> {agent_type} : create_agent()")
                
                uml.append("")
                uml.append("== Simulation Execution ==")
                
                uml.append(f"{engine_class} -> {engine_class} : start_simulation()")
                
                # Agent interactions
                if len(self.agent_types) >= 2:
                    agent_types = list(self.agent_types)[:2]
                    uml.append(f"{agent_types[0]} -> {agent_types[1]} : interact()")
                    uml.append(f"{agent_types[1]} -> {agent_types[0]} : respond()")
                
                # Results
                uml.append(f"{engine_class} -> CLI : simulation_results")
                uml.append("CLI -> User : Display results")
        
        # Web interface flow
        if self.web_components:
            uml.append("")
            uml.append("== Web Interface ==")
            uml.append("User -> Web : View simulation")
            uml.append("Web -> Web : Real-time updates")
            uml.append("Web -> User : Display visualization")
        
        uml.append("")
        uml.append("@enduml")
        
        self._write_uml_file("simulation_flow.puml", "\n".join(uml))

    def generate_system_architecture(self):
        """Generate overall system architecture"""
        uml = []
        uml.append("@startuml Living Twin Simulation - System Architecture")
        uml.append("!theme plain")
        uml.append("title System Architecture Overview - Auto Generated")
        uml.append("")
        
        # CLI Layer
        if self.cli_components:
            uml.append("package \"CLI Interface\" {")
            for cli_name in self.cli_components.keys():
                uml.append(f"  [{cli_name}]")
            uml.append("}")
            uml.append("")
        
        # Web Layer
        if self.web_components:
            uml.append("package \"Web Interface\" {")
            uml.append("  package \"Next.js Frontend\" {")
            for web_name, web_info in list(self.web_components.items())[:5]:
                components = [c for c in web_info.classes if "Component" in c]
                if components:
                    comp_name = components[0].replace(" (Component)", "")
                    uml.append(f"    [{comp_name}]")
            uml.append("  }")
            uml.append("}")
            uml.append("")
        
        # Core Simulation
        uml.append("package \"Simulation Core\" {")
        
        # Engines
        if self.simulation_engines:
            uml.append("  package \"Engines\" {")
            for engine_name, engine_info in self.simulation_engines.items():
                for class_name in engine_info.classes:
                    uml.append(f"    [{class_name}] as {class_name}_engine")
            uml.append("  }")
        
        # Agents
        if self.agent_types:
            uml.append("  package \"Agents\" {")
            for agent_type in self.agent_types:
                uml.append(f"    [{agent_type}] as {agent_type}_agent")
            uml.append("  }")
        
        uml.append("}")
        uml.append("")
        
        # Configuration
        if self.config_components:
            uml.append("package \"Configuration\" {")
            for config_name in self.config_components.keys():
                uml.append(f"  [{config_name}]")
            uml.append("}")
            uml.append("")
        
        # Technology stack
        if self.python_deps or self.node_deps:
            uml.append("package \"Technology Stack\" {")
            
            if self.python_deps:
                uml.append("  package \"Python\" {")
                for dep in sorted(self.python_deps):
                    dep_id = dep.replace(" ", "").replace(".", "")
                    uml.append(f"    [{dep}] as {dep_id}")
                uml.append("  }")
            
            if self.node_deps:
                uml.append("  package \"Frontend\" {")
                for dep in sorted(self.node_deps):
                    dep_id = dep.replace(" ", "").replace(".", "")
                    uml.append(f"    [{dep}] as {dep_id}")
                uml.append("  }")
            
            uml.append("}")
            uml.append("")
        
        # Relationships
        uml.append("' System relationships")
        if self.cli_components and self.simulation_engines:
            cli_name = list(self.cli_components.keys())[0]
            engine_name = list(self.simulation_engines.keys())[0]
            engine_class = self.simulation_engines[engine_name].classes[0] if self.simulation_engines[engine_name].classes else engine_name
            uml.append(f"[{cli_name}] --> [{engine_class}_engine]")
        
        if self.web_components and self.simulation_engines:
            web_name = list(self.web_components.keys())[0]
            engine_name = list(self.simulation_engines.keys())[0]
            engine_class = self.simulation_engines[engine_name].classes[0] if self.simulation_engines[engine_name].classes else engine_name
            uml.append(f"[{web_name}] --> [{engine_class}_engine] : WebSocket")
        
        if self.simulation_engines and self.agent_types:
            engine_name = list(self.simulation_engines.keys())[0]
            engine_class = self.simulation_engines[engine_name].classes[0] if self.simulation_engines[engine_name].classes else engine_name
            for agent_type in list(self.agent_types)[:3]:
                uml.append(f"[{engine_class}_engine] --> [{agent_type}_agent]")
        
        uml.append("")
        uml.append("@enduml")
        
        self._write_uml_file("system_architecture.puml", "\n".join(uml))

    def generate_agent_interactions(self):
        """Generate agent interaction diagrams"""
        uml = []
        uml.append("@startuml Living Twin Simulation - Agent Interactions")
        uml.append("title Agent Communication Patterns - Auto Generated")
        uml.append("")
        
        if len(self.agent_types) >= 2:
            # Create interaction diagram between agents
            agent_list = list(self.agent_types)[:4]  # Limit to 4 agents
            
            for agent in agent_list:
                uml.append(f"participant \"{agent}\" as {agent}")
            
            if self.simulation_engines:
                engine_values = list(self.simulation_engines.values())
                engine_name = engine_values[0].classes[0] if engine_values and engine_values[0].classes else "SimulationEngine"
                uml.append(f"participant \"Simulation Engine\" as {engine_name}")
            
            uml.append("")
            uml.append("== Agent Initialization ==")
            
            if self.simulation_engines:
                for agent in agent_list:
                    uml.append(f"{engine_name} -> {agent} : initialize()")
            
            uml.append("")
            uml.append("== Agent Interactions ==")
            
            # Create interaction patterns
            for i, agent1 in enumerate(agent_list):
                for j, agent2 in enumerate(agent_list):
                    if i < j:  # Avoid duplicate interactions
                        uml.append(f"{agent1} -> {agent2} : message()")
                        uml.append(f"{agent2} -> {agent1} : response()")
            
            uml.append("")
            uml.append("== Simulation Updates ==")
            
            if self.simulation_engines:
                for agent in agent_list:
                    uml.append(f"{agent} -> {engine_name} : update_state()")
        
        else:
            uml.append("note as N1")
            uml.append("  Limited agent types detected.")
            uml.append("  Agent interactions will be shown")
            uml.append("  when multiple agent types are found.")
            uml.append("end note")
        
        uml.append("")
        uml.append("@enduml")
        
        self._write_uml_file("agent_interactions.puml", "\n".join(uml))

    def generate_system_description(self):
        """Generate system description markdown"""
        md = []
        
        md.append("# Living Twin Simulation - System Overview")
        md.append("")
        md.append("*Auto-generated system documentation*")
        md.append("")
        md.append(f"Generated on: {datetime.now().isoformat()}")
        md.append("")
        
        # System Architecture
        md.append("## System Architecture")
        md.append("")
        md.append("![System Architecture](./system_architecture.png)")
        md.append("")
        
        # Agent Architecture
        if self.agent_types:
            md.append("## Agent Architecture")
            md.append("")
            md.append("![Agent Architecture](./agent_architecture.png)")
            md.append("")
            
            md.append(f"### Discovered Agent Types ({len(self.agent_types)} types)")
            for agent_type in sorted(self.agent_types):
                md.append(f"- **{agent_type}**: Autonomous simulation agent")
            md.append("")
        
        # Simulation Flow
        md.append("## Simulation Flow")
        md.append("")
        md.append("![Simulation Flow](./simulation_flow.png)")
        md.append("")
        
        # Agent Interactions
        if len(self.agent_types) >= 2:
            md.append("## Agent Interactions")
            md.append("")
            md.append("![Agent Interactions](./agent_interactions.png)")
            md.append("")
        
        # Components Analysis
        md.append(f"### System Components ({len(self.components)} total)")
        md.append("")
        
        if self.simulation_engines:
            md.append(f"#### Simulation Engines ({len(self.simulation_engines)} engines)")
            for engine_name, engine_info in self.simulation_engines.items():
                md.append(f"- **{engine_name}**: {len(engine_info.classes)} classes, {len(engine_info.functions)} functions")
                md.append(f"  - Path: `{engine_info.path}`")
                if engine_info.classes:
                    md.append(f"  - Classes: {', '.join(engine_info.classes)}")
            md.append("")
        
        if self.agents:
            md.append(f"#### Agent Components ({len(self.agents)} components)")
            for agent_name, agent_info in self.agents.items():
                md.append(f"- **{agent_name}**: {len(agent_info.classes)} classes")
                md.append(f"  - Path: `{agent_info.path}`")
            md.append("")
        
        if self.web_components:
            md.append(f"#### Web Interface ({len(self.web_components)} components)")
            for web_name, web_info in self.web_components.items():
                components = [c for c in web_info.classes if "Component" in c]
                md.append(f"- **{web_name}**: {len(components)} React components")
                md.append(f"  - Path: `{web_info.path}`")
            md.append("")
        
        if self.cli_components:
            md.append(f"#### CLI Interface ({len(self.cli_components)} components)")
            for cli_name, cli_info in self.cli_components.items():
                md.append(f"- **{cli_name}**: {len(cli_info.functions)} functions")
                md.append(f"  - Path: `{cli_info.path}`")
            md.append("")
        
        # Technology Stack
        md.append("## Technology Stack")
        md.append("")
        
        if self.python_deps:
            md.append("### Python Technologies")
            for dep in sorted(self.python_deps):
                md.append(f"- **{dep}**")
            md.append("")
        
        if self.node_deps:
            md.append("### Frontend Technologies")
            for dep in sorted(self.node_deps):
                md.append(f"- **{dep}**")
            md.append("")
        
        # Simulation Patterns
        if self.simulation_patterns:
            md.append("## Simulation Patterns")
            md.append("")
            for pattern in set(self.simulation_patterns):
                md.append(f"- **{pattern}**: Detected in codebase")
            md.append("")
        
        # Architecture Insights
        md.append("## Architecture Insights")
        md.append("")
        
        insights = []
        if self.agent_types:
            insights.append(f"**Multi-Agent System**: {len(self.agent_types)} different agent types")
        if "Async Processing" in self.simulation_patterns:
            insights.append("**Asynchronous Architecture**: Non-blocking simulation execution")
        if "Real-time Communication" in self.simulation_patterns:
            insights.append("**Real-time Updates**: WebSocket-based communication")
        if self.web_components:
            insights.append("**Web Visualization**: Next.js frontend for simulation monitoring")
        if self.cli_components:
            insights.append("**CLI Interface**: Command-line simulation control")
        
        for insight in insights:
            md.append(f"- {insight}")
        md.append("")
        
        # PlantUML Sources
        md.append("## PlantUML Source Files")
        md.append("")
        md.append("- [System Architecture](./system_architecture.puml)")
        md.append("- [Agent Architecture](./agent_architecture.puml)")
        md.append("- [Simulation Flow](./simulation_flow.puml)")
        md.append("- [Agent Interactions](./agent_interactions.puml)")
        md.append("")
        
        md.append("---")
        md.append("*This documentation is automatically generated. To update, run: `make uml`*")
        
        self._write_file("SYSTEM.md", "\n".join(md))

    def render_diagrams(self):
        """Render PlantUML diagrams to PNG"""
        puml_files = [
            "system_architecture.puml",
            "agent_architecture.puml",
            "simulation_flow.puml",
            "agent_interactions.puml"
        ]
        
        for puml_file in puml_files:
            try:
                result = subprocess.run([
                    "plantuml", str(self.docs_path / puml_file)
                ], capture_output=True, text=True)
                
                if result.returncode != 0:
                    print(f"⚠️ Warning: Could not render {puml_file}")
                    print(f"   Error: {result.stderr}")
                    print("   Install PlantUML: brew install plantuml")
                    
            except FileNotFoundError:
                print("⚠️ PlantUML not found. Install with: brew install plantuml")
                print("   Or view .puml files in VS Code with PlantUML extension")
                break

    def _write_uml_file(self, filename: str, content: str):
        """Write UML file to docs directory"""
        self._write_file(filename, content)

    def _write_file(self, filename: str, content: str):
        """Write file to docs directory"""
        self.docs_path.mkdir(parents=True, exist_ok=True)
        file_path = self.docs_path / filename
        
        with file_path.open("w", encoding="utf-8") as f:
            f.write(content)
        
        print(f"📝 Generated: {file_path}")

def main():
    """Main entry point"""
    try:
        project_root = os.getcwd()
        generator = UMLGenerator(project_root)
        
        print("🚀 Living Twin Simulation - UML Generator")
        print(f"📂 Project: {project_root}")
        print("")
        
        generator.generate_all()
        
        print("")
        print("🎉 System documentation generated successfully!")
        print("📖 View: docs/system/SYSTEM.md")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        print("📍 Stack trace:")
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()