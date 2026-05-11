import React from "react";
import { db } from "@/lib/db";
import "./styles.css";

const fs = require("fs");
const util = require("./util");

async function load() {
  const mod = await import("./dynamic");
}