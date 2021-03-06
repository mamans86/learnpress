<?php
/**
 * @author  ThimPress
 * @package LearnPress/Admin/Views
 * @version 4.0.0
 */

defined( 'ABSPATH' ) || exit();

learn_press_admin_view( 'updates/html-update-modal' );
?>

<div class="card">
	<h2><?php esc_html_e( 'Upgrade Database', 'learnpress' ); ?></h2>
	<p><?php esc_html_e( 'Force upgrade database to latest version. Please be careful before taking this action.', 'learnpress' ); ?></p>
	<p class="tools-button">
		<a class="button lp-button-upgrade" data-context="tool" href="<?php echo esc_url( admin_url( 'index.php?do-update-learnpress=yes' ) ); ?>"><?php esc_html_e( 'Upgrade now', 'learnpress' ); ?></a>
	</p>
</div>
