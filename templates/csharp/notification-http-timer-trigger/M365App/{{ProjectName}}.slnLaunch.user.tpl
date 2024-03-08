[
{{#enableTestToolByDefault}}
  {
    "Name": "Teams App Test Tool (browser)",
    "Projects": [
      {
        "Name": "M365App\\M365App.maproj",
        "Action": "StartWithoutDebugging",
        "DebugTarget": "Teams App Test Tool (browser)"
      },
      {
        "Name": "{{ProjectName}}\\{{ProjectName}}.csproj",
        "Action": "Start",
        "DebugTarget": "Teams App Test Tool"
      }
    ]
  },
{{/enableTestToolByDefault}}
  {
    "Name": "Microsoft Teams (browser)",
    "Projects": [
      {
        "Name": "M365App\\M365App.maproj",
        "Action": "StartWithoutDebugging",
        "DebugTarget": "Microsoft Teams (browser)"
      },
      {
        "Name": "{{ProjectName}}\\{{ProjectName}}.csproj",
        "Action": "Start",
        "DebugTarget": "Start Project"
      }
    ]
{{#enableTestToolByDefault}}
  }
{{/enableTestToolByDefault}}
{{^enableTestToolByDefault}}
  },
  {
    "Name": "Teams App Test Tool (browser)",
    "Projects": [
      {
        "Name": "M365App\\M365App.maproj",
        "Action": "StartWithoutDebugging",
        "DebugTarget": "Teams App Test Tool (browser)"
      },
      {
        "Name": "{{ProjectName}}\\{{ProjectName}}.csproj",
        "Action": "Start",
        "DebugTarget": "Teams App Test Tool"
      }
    ]
  }
{{/enableTestToolByDefault}}
]