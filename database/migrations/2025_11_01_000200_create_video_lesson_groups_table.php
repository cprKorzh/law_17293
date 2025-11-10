<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('video_lesson_groups', function (Blueprint $table) {
            $table->id();
            $table->foreignId('video_lesson_id')->constrained()->onDelete('cascade');
            $table->foreignId('group_id')->constrained()->onDelete('cascade');
            $table->timestamps();
            
            $table->unique(['video_lesson_id', 'group_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('video_lesson_groups');
    }
};
