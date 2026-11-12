# Conditions, lists, and virtualization

Use structural directives to create and remove subtrees, and stable item identity to retain list state. Visibility changes and structural removal have different lifetimes.

**Version scope:** historical PXML 1.0 and its matching runtime. For current plugins, use [ABI 100](/en/plugin-sdk/).

Structural directives instantiate or remove blueprint subtrees; they are not opacity switches.

## If and Switch

```xml
<x:If Condition="{bind Account.IsLoggedIn}">
  <Text Text="Signed in" />
  <x:Else><Button Text="Sign in" Command="{cmd Account.Login}" /></x:Else>
</x:If>

<x:Switch Value="{bind Download.State}">
  <x:Case Value="Idle"><Text Text="Idle" /></x:Case>
  <x:Case Value="Downloading"><Text Text="Downloading" /></x:Case>
  <x:Default><Text Text="Unknown state" /></x:Default>
</x:Switch>
```

Use If for two branches and Switch for several mutually exclusive states.

## For

```xml
<x:For Each="{bind RecentFiles}" As="file" Key="{file.Id}">
  <Text Text="{file.Name}" />
</x:For>
```

For is suitable for small collections whose items all need entities. Keys must be unique and stable within a collection version.

## VirtualList

```xml
<VirtualList
  Items="{bind Mods}"
  Key="{item.Id}"
  EstimatedItemHeight="48"
  OverscanBefore="2"
  OverscanAfter="3">
  <Template As="item"><ModItem Mod="{item}" /></Template>
</VirtualList>
```

Only viewport + overscan items receive slots. Scrolling preserves slots that remain in range and rebinds entering items. Offset/index operations stay `O(log N)`, measured extents are retained by current keys, removed keys are pruned on source refresh, and 100,000 logical items never become 100,000 entities.

Use runtime If/feature for observable state and `x:IfBuild` for compile-time platform/edition branches.

Next: [Components, templates, and slots](./Components-and-Templates).

## Check your result

Insert, remove and reorder items while a row is focused, then test a list large enough to use virtualization.
