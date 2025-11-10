<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Group;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GroupController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Groups/Index', [
            'groups' => Group::withCount('users')->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Groups/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:groups',
            'description' => 'nullable|string|max:500',
        ]);

        Group::create($request->only(['name', 'description']));

        return redirect()->route('admin.groups.index')->with('success', 'Группа создана');
    }

    public function edit(Group $group)
    {
        return Inertia::render('Admin/Groups/Edit', [
            'group' => $group
        ]);
    }

    public function update(Request $request, Group $group)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:groups,name,' . $group->id,
            'description' => 'nullable|string|max:500',
        ]);

        $group->update($request->only(['name', 'description']));

        return redirect()->route('admin.groups.index')->with('success', 'Группа обновлена');
    }

    public function destroy(Group $group)
    {
        if ($group->users()->count() > 0) {
            return redirect()->route('admin.groups.index')->with('error', 'Нельзя удалить группу с пользователями');
        }

        $group->delete();
        return redirect()->route('admin.groups.index')->with('success', 'Группа удалена');
    }
}
