<main>
    <div class="content">
        <!-- Inputs -->
        <div class="input-section">
            <?php echo $sections; ?>
            <?php echo $assignments; ?>
        </div>
        <div class="input-section">
            <!-- Custom Search Bar -->
            <div class="search-bar">
                <span class="ion ion-android-search"></span>
                <input type="search" name="search_assignment" placeholder="Search Assignments">
            </div>
        </div>

        <!-- Table Content -->
        <h2>Export</h2>
        <div class="table-group">
            <?php echo $table; ?>
        </div>

        <div class="upcoming-container"></div>
    </div><!-- End of content -->
</main>