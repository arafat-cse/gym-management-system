<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Admin\EquipmentMaintenanceRequest;
use App\Http\Requests\Api\Admin\EquipmentRequest;
use App\Models\Equipment;

class EquipmentController extends Controller
{
    public function index()
    {
        return Equipment::with('branch')->paginate(20);
    }

    public function store(EquipmentRequest $request)
    {
        $equipment = Equipment::create($request->validated());

        return response()->json($equipment, 201);
    }

    public function show(Equipment $equipment)
    {
        return $equipment->load(['branch', 'maintenanceRecords']);
    }

    public function update(EquipmentRequest $request, Equipment $equipment)
    {
        $equipment->update($request->validated());

        return $equipment->fresh();
    }

    public function destroy(Equipment $equipment)
    {
        $equipment->delete();

        return response()->json(null, 204);
    }

    public function maintenance(Equipment $equipment)
    {
        return $equipment->maintenanceRecords;
    }

    public function addMaintenance(EquipmentMaintenanceRequest $request, Equipment $equipment)
    {
        $record = $equipment->maintenanceRecords()->create($request->validated());

        $equipment->update(['status' => 'maintenance']);

        return response()->json($record, 201);
    }
}
