#!/usr/bin/env ruby
require_relative './FixtureBuilder'

builder = FixtureBuilder.new
builder.clear_all

project = builder.create_project(id: 'test-project', title: 'Projet Test', brins: ['b1', 'b2', 'b3', 'b4'])

event1 = builder.create_event(project_id: project, id: 'e1', title: 'Event 1', brins: ['b1', 'b2'])
event2 = builder.create_event(project_id: project, id: 'e2', title: 'Event 2', brins: ['b2', 'b3'])
event3 = builder.create_event(project_id: project, id: 'e3', title: 'Event 3', brins: [])

builder.create_brin(id: 'b1', title: 'Brin A', badge: 'BRA', color: '#d9c8a9')
builder.create_brin(id: 'b2', title: 'Brin B', badge: 'BRB', color: '#c8d9a9')
builder.create_brin(id: 'b3', title: 'Brin C', badge: 'BRC', color: '#a9d9c8')
builder.create_brin(id: 'b4', title: 'Brin D', badge: 'BRD', color: '#a9c8d9')

builder.close
