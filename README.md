Hex RPG

A turn-based tactical RPG built on a hexagonal grid.
This project focuses on gameplay systems such as movement, pathfinding, ability targeting, and range calculation rather than visuals.
Core Systems

    Hex grid coordinate system (offset → cube conversion)
    Hex distance calculation
    A* pathfinding on hex grids
    Terrain-based movement blocking
    Line-of-sight and range validation
    Ability targeting (character / hex / none)
    Turn order and action point system

Hex Grid Coordinate System

The game uses an offset-coordinate grid for storage and rendering, which is converted to cube coordinates for distance and path calculations.

Cube coordinates allow:

    Constant-time distance calculation
    Clean neighbor traversal
    Simpler pathfinding heuristics

Distance is calculated using:

max(|dx|, |dy|, |dz|)
Pathfinding & Movement

Movement uses A* pathfinding adapted for hex grids.

Features:

    Blocks movement through impassable terrain
    Respects character movement speed
    Prevents pathing through walls
    Visual path preview before movement

Ability System

Abilities define:

    Range
    Target type (character, hex, or none)
    Area of effect
    Action point and mana cost

Target validation is handled globally:

    Click-based targeting
    Range checking using hex distance
    Team-based logic (ally vs enemy effects)

This allows abilities to remain declarative while input handling stays centralized.
Turn System

    Characters act in a fixed turn order determined by an initial random roll plus a dexterity modifier
    Each turn provides action points and bonus actions
    Team membership determines valid targets and ability effects

Tech Stack

    TypeScript
    HTML Canvas
    Custom rendering & input handling
    Project management via JIRA
    No external game engines

Project Status

This project is actively developed as a systems-focused sandbox for experimenting with turn-based mechanics and hex grid logic.

Planned improvements include:

    Higher-quality visual assets (hexes, characters, abilities)
    Codebase cleanup and consistency improvements
    Networked multiplayer (netcode)
    Character talent system for build variety
    Expanded stat interactions (e.g. dexterity influencing turn order)
