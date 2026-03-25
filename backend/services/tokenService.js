exports.getPriorityScore = (category, age) => {
  if (category === "disabled") return 1;
  if (category === "pregnant") return 2;
  if (category === "senior" || age >= 60) return 3;
  return 4;
};
