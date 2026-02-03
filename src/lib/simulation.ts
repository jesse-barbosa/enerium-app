export function calculateEquipmentKwh(equipment: any) {
  return (
    (equipment.power_watts *
      equipment.hours_per_day *
      equipment.days_per_month *
      equipment.quantity) / 1000
  );
}

export function calculateEnvironmentSimulation(equipments: any[], tariff: number) {
  const totalKwh = equipments.reduce(
    (sum, eq) => sum + calculateEquipmentKwh(eq),
    0
  );

  return {
    totalKwh,
    totalCost: totalKwh * tariff,
  };
}