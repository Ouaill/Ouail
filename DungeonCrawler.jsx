import React, { useRef, useEffect, useState } from 'react';

const RACES = [
  {
    label: "Humain", key: "humain",
    bonus: { strength: 2, endurance: 2, agility: 2, intelligence: 2, wisdom: 2, perception: 2 },
    passive: "Apprentissage rapide (+10% XP)" },
  {
    label: "Elfe", key: "elfe",
    bonus: { strength: 0, endurance: 0, agility: 2, intelligence: 4, wisdom: 0, perception: 2 },
    passive: "Mana +20%, Vision dans le noir" },
  {
    label: "Nain", key: "nain",
    bonus: { strength: 4, endurance: 2, agility: 0, intelligence: -2, wisdom: 0, perception: 0 },
    passive: "Résistance poison, Détection trésors" },
  {
    label: "Orc", key: "orc",
    bonus: { strength: 6, endurance: 0, agility: 0, intelligence: -2, wisdom: 0, perception: -2 },
    passive: "Rage (dégâts +50% si HP < 25%)" }
];

const CLASSES = [
  {
    label: "Guerrier", key: "warrior",
    primary: ["strength", "endurance"],
    skills: ["Frappe puissante", "Blocage"],
    bonus: { maxHp: 20, maxMana: 0 },
    style: "Mêlée tank" },
  {
    label: "Mage", key: "mage",
    primary: ["intelligence", "wisdom"],
    skills: ["Boule de feu", "Bouclier magique"],
    bonus: { maxHp: 0, maxMana: 30 },
    style: "DPS magique" },
  {
    label: "Voleur", key: "thief",
    primary: ["agility", "perception"],
    skills: ["Crochetage", "Attaque sournoise"],
    bonus: { maxHp: 0, maxMana: 10 },
    style: "Furtif, critique" },
  {
    label: "Paladin", key: "paladin",
    primary: ["strength", "wisdom"],
    skills: ["Soin mineur", "Frappe sacrée"],
    bonus: { maxHp: 10, maxMana: 15 },
    style: "Hybride équilibré" }
];

const BASE_ATTRIBUTES = {
  strength: 10, endurance: 10, agility: 10, intelligence: 10, wisdom: 10, perception: 10,
};

const TILE_TYPES = {
  VOID: 0, FLOOR: 1, WALL: 2, DOOR: 3, DOOR_OPEN: 4, SECRET_WALL: 5,
  STAIRS_DOWN: 6, STAIRS_UP: 7, WATER: 8, LAVA: 9
};
const TILE_COLORS = {
  [TILE_TYPES.FLOOR]: "#222",
  [TILE_TYPES.WALL]: "#777",
  [TILE_TYPES.DOOR]: "#B8860B",
  [TILE_TYPES.DOOR_OPEN]: "#EBE76C",
  [TILE_TYPES.SECRET_WALL]: "#202234",
  [TILE_TYPES.WATER]: "#3287ff",
  [TILE_TYPES.LAVA]: "#ad3d18",
  [TILE_TYPES.STAIRS_DOWN]: "#557333",
  [TILE_TYPES.STAIRS_UP]: "#888888"
};

const RAYCASTING_CONFIG = {
  fov: 60, rayCount: 100, maxRenderDistance: 12, wallHeight: 1,
  screenWidth: 800, screenHeight: 420
};

const DUNGEON_CONFIG = {
  width: 24, height: 24, minRoomSize: 4, maxRoomSize: 8, roomCount: 7, corridorWidth: 1,
  enemyDensity: 0.05, treasureDensity: 0.02, trapDensity: 0.01, secretDensity: 0.01,
};

function clone(obj) { return JSON.parse(JSON.stringify(obj)); }...