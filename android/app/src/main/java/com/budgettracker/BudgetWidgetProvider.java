package com.budgettracker;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.widget.RemoteViews;
import java.text.NumberFormat;
import java.util.Locale;

/**
 * Native Android Home Screen Widget Provider for Salary Budget Tracker
 */
public class BudgetWidgetProvider extends AppWidgetProvider {

    private static final String PREFS_NAME = "rn_daily_budget_data";

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId);
        }
    }

    static void updateAppWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        // Read remaining balance from shared preferences
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        double remaining = prefs.getFloat("remaining_balance", 11153.80f);

        // Format Currency ₱
        NumberFormat pesoFormat = NumberFormat.getCurrencyInstance(new Locale("en", "PH"));
        String formattedBalance = pesoFormat.format(remaining);

        // Construct RemoteViews object for Android Widget Layout
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.budget_widget);
        views.setTextViewText(R.id.widget_remaining_val, formattedBalance);

        // Intent to launch main App when widget is tapped
        Intent launchIntent = context.getPackageManager().getLaunchIntentForPackage(context.getPackageName());
        if (launchIntent != null) {
            PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, launchIntent, PendingIntent.FLAG_IMMUTABLE);
            views.setOnClickPendingIntent(R.id.widget_container, pendingIntent);
        }

        // Instruct widget manager to update widget
        appWidgetManager.updateAppWidget(appWidgetId, views);
    }
}
