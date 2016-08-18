---
layout: page
title: Ex-Presidents of the United States
---
This is a list of all ex-Presidents of the United States and their periods
of ex-presidency.

<table id="expotus-table">
  <thead>
    <tr>
      <th>#</th>
      <th>Name</th>
      <th>Start</th>
      <th>End</th>
    </tr>
  </thead>
  <tbody>
    {% assign sorted = site.expotuses | sort: "order" %}
    {% for expotus in sorted %}

      <tr>
        <td>{{ expotus.order }}</td>
        <td><a href="{{ expotus.url }}">{{ expotus.title }}</a></td>
        <td>{{ expotus.start }}</td>
        <td>{{ expotus.end }}</td>
      </tr>
    {% endfor %}
  </tbody>
</table>

{% include datatable.html table_id="expotus-table" %}
