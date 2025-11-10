@props(['url'])
<tr>
<td class="header">
<a href="{{ $url }}" style="display: inline-block;">
@if (trim($slot) === 'Rus-Korea Driving Center')
<img src="{{ asset('logo-gray.svg') }}" class="logo" alt="Law 17293 Logo" style="height: 75px; width: auto;">
@else
{!! $slot !!}
@endif
</a>
</td>
</tr>
