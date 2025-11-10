<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('video_lessons', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->date('lesson_date');
            $table->integer('order_index')->default(0);
            $table->string('kinescope_video_id');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->foreign('kinescope_video_id')->references('id')->on('kinescope_videos')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('video_lessons');
    }
};
