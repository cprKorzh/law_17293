<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Сначала очищаем таблицу video_lessons, так как меняется структура
        DB::table('video_lessons')->delete();
        
        Schema::table('video_lessons', function (Blueprint $table) {
            $table->foreignId('playlist_id')->after('id')->constrained()->onDelete('cascade');
        });

        // Удаляем старую таблицу связей, так как теперь связь через плейлисты
        Schema::dropIfExists('video_lesson_groups');
    }

    public function down(): void
    {
        Schema::create('video_lesson_groups', function (Blueprint $table) {
            $table->id();
            $table->foreignId('video_lesson_id')->constrained()->onDelete('cascade');
            $table->foreignId('group_id')->constrained()->onDelete('cascade');
            $table->timestamps();
            
            $table->unique(['video_lesson_id', 'group_id']);
        });

        Schema::table('video_lessons', function (Blueprint $table) {
            $table->dropForeign(['playlist_id']);
            $table->dropColumn('playlist_id');
        });
    }
};
