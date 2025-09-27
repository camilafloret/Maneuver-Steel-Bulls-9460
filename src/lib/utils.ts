
export const SCOUTING_DATA_HEADER = [
  "id","matchNumber","alliance","scouterInitials","selectTeam",
  "startPoses0","startPoses1","startPoses2","startPoses3","startPoses4","startPoses5",
  "autoCoralPlaceL1Count","autoCoralPlaceL2Count","autoCoralPlaceL3Count","autoCoralPlaceL4Count","autoCoralPlaceDropMissCount",
  "autoCoralPickPreloadCount","autoCoralPickStationCount","autoCoralPickMark1Count","autoCoralPickMark2Count","autoCoralPickMark3Count",
  "autoAlgaePlaceNetShot","autoAlgaePlaceProcessor","autoAlgaePlaceDropMiss","autoAlgaePlaceRemove",
  "autoAlgaePickReefCount","autoAlgaePickMark1Count","autoAlgaePickMark2Count","autoAlgaePickMark3Count",
  "autoPassedStartLine",
  "teleopCoralPlaceL1Count","teleopCoralPlaceL2Count","teleopCoralPlaceL3Count","teleopCoralPlaceL4Count","teleopCoralPlaceDropMissCount",
  "teleopCoralPickStationCount","teleopCoralPickCarpetCount",
  "teleopAlgaePlaceNetShot","teleopAlgaePlaceProcessor","teleopAlgaePlaceDropMiss","teleopAlgaePlaceRemove",
  "teleopAlgaePickReefCount","teleopAlgaePickCarpetCount",
  "shallowClimbAttempted","deepClimbAttempted","parkAttempted","climbFailed","playedDefense","brokeDown","comment"
];
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertArrayOfArraysToCSV(data: (string | number)[][]): string {
  return data
    .map((row) =>
      row
        .map((item) =>
          typeof item === "string"
            ? `"${item.replace(/"/g, '""')}"`
            : item
        )
        .join(",")
    )
    .join("\n");
}

export const convertTeamRole = (value: string | null) => {
      switch (value) {
        case "lead":
          return "Líder";
        case "red-1":
          return "Vermelho 1";
        case "red-2":
          return "Vermelho 2";
        case "red-3":
          return "Vermelho 3";
        case "blue-1":
          return "Azul 1";
        case "blue-2":
          return "Azul 2";
        case "blue-3":
          return "Azul 3";
      }
      return "Função";
    };
