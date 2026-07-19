<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RolesSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            'manage-members',
            'manage-staff',
            'manage-trainers',
            'manage-plans',
            'manage-registrations',
            'view-payments',
            'manage-payments',
            'manage-settings',
            'view-own-profile',
            'manage-own-profile',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        $rolePermissions = [
            'admin' => $permissions,
            'staff' => ['manage-members', 'manage-registrations', 'view-payments', 'view-own-profile', 'manage-own-profile'],
            'trainer' => ['view-own-profile', 'manage-own-profile'],
            'member' => ['view-own-profile', 'manage-own-profile'],
        ];

        foreach ($rolePermissions as $roleName => $perms) {
            $role = Role::firstOrCreate(['name' => $roleName]);
            $role->permissions()->sync(
                Permission::whereIn('name', $perms)->pluck('id')
            );
        }
    }
}
