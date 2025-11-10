<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $names = ['Иван', 'Петр', 'Сергей', 'Алексей', 'Дмитрий', 'Андрей', 'Михаил', 'Владимир', 'Николай', 'Александр'];
        $surnames = ['Иванов', 'Петров', 'Сидоров', 'Козлов', 'Волков', 'Смирнов', 'Попов', 'Лебедев', 'Новиков', 'Морозов'];
        $patronimics = ['Иванович', 'Петрович', 'Сергеевич', 'Алексеевич', 'Дмитриевич', 'Андреевич', 'Михайлович', 'Владимирович', 'Николаевич', 'Александрович'];

        return [
            'name' => fake()->randomElement($names),
            'surname' => fake()->randomElement($surnames),
            'patronimic' => fake()->randomElement($patronimics),
            'username' => fake()->unique()->userName(),
            'email' => fake()->boolean(50) ? fake()->unique()->safeEmail() : null,
            'tel' => '+7 9' . fake()->numerify('#########'),
            'password' => 'password',
            'role' => 'user',
            'group_id' => fake()->numberBetween(1, 2),
            'training_suspended' => false,
            'suspension_reason' => null,
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    /**
     * Indicate that the model does not have two-factor authentication configured.
     */
    public function withoutTwoFactor(): static
    {
        return $this->state(fn (array $attributes) => [
            'two_factor_secret' => null,
            'two_factor_recovery_codes' => null,
            'two_factor_confirmed_at' => null,
        ]);
    }

    /**
     * Create an admin user.
     */
    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'admin',
        ]);
    }
}
