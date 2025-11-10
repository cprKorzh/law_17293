<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kinescope_projects', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name');
            $table->timestamps();
        });

        Schema::create('kinescope_folders', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name');
            $table->string('project_id');
            $table->string('parent_id')->nullable();
            $table->timestamps();
            
            $table->foreign('project_id')->references('id')->on('kinescope_projects')->onDelete('cascade');
        });

        Schema::create('kinescope_videos', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('title');
            $table->string('folder_id');
            $table->decimal('duration', 10, 3)->nullable();
            $table->string('status')->nullable();
            $table->timestamps();
            
            $table->foreign('folder_id')->references('id')->on('kinescope_folders')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kinescope_videos');
        Schema::dropIfExists('kinescope_folders');
        Schema::dropIfExists('kinescope_projects');
    }
};
